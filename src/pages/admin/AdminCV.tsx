/**
 * AdminCV — single-document editor for /cv/main.
 *
 * The CV doc is a tree (hero / summary / skills / experience / projects /
 * education / languages / interests). Each nested list is editable inline
 * with add/remove/move controls. One "Save changes" button persists the
 * whole document.
 */
import { useEffect, useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Save, RotateCcw } from 'lucide-react';
import { getCV, saveCV } from '../../lib/repositories/cv';
import { invalidateCache } from '../../lib/cache';
import type {
  CVDoc,
  CVHero,
  CVSkillGroup,
  CVRole,
  CVProject,
  CVEducation,
  CVLanguage,
} from '../../lib/types';
import {
  Button,
  Field,
  Input,
  Textarea,
  TagInput,
  PageHeader,
  LoadingState,
} from '../../components/admin/ui';
import { pushToast } from '../../components/admin/toast-utils';

const emptyCV: CVDoc = {
  hero: {
    name: '',
    title: '',
    location: '',
    phone: '',
    email: '',
    portfolio: '',
    linkedin: '',
    github: '',
  },
  summary: '',
  skills: [],
  experience: [],
  projects: [],
  education: [],
  languages: [],
  interests: [],
};

export default function AdminCV() {
  const [cv, setCV] = useState<CVDoc | null>(null);
  const [originalJson, setOriginalJson] = useState<string>('');
  const [saving, setSaving] = useState(false);

  async function load() {
    const fresh = await getCV();
    const next = fresh ?? emptyCV;
    setCV(next);
    setOriginalJson(JSON.stringify(next));
    invalidateCache('cv');
  }

  useEffect(() => {
    load().catch((err) => pushToast('error', `Failed to load: ${(err as Error).message}`));
  }, []);

  const dirty = cv ? JSON.stringify(cv) !== originalJson : false;

  async function handleSave() {
    if (!cv) return;
    setSaving(true);
    try {
      await saveCV(cv);
      setOriginalJson(JSON.stringify(cv));
      invalidateCache('cv');
      pushToast('success', 'CV saved');
    } catch (err) {
      pushToast('error', (err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  function patch<K extends keyof CVDoc>(key: K, value: CVDoc[K]) {
    setCV((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  if (cv === null) {
    return (
      <div className="p-8">
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl">
      <PageHeader
        title="CV"
        description="Single document at /cv/main. Edit any section then save."
        actions={
          <>
            {dirty && (
              <Button variant="ghost" icon={<RotateCcw size={14} />} onClick={() => load()}>
                Discard
              </Button>
            )}
            <Button
              icon={<Save size={14} />}
              onClick={handleSave}
              loading={saving}
              disabled={!dirty}
            >
              Save changes
            </Button>
          </>
        }
      />

      {dirty && (
        <div className="mb-6 text-xs text-amber-300 bg-amber-500/5 border border-amber-500/20 rounded-md px-3 py-2">
          You have unsaved changes.
        </div>
      )}

      <div className="space-y-8">
        <HeroSection hero={cv.hero} onChange={(hero) => patch('hero', hero)} />

        <Section title="Summary" hint="One paragraph elevator pitch.">
          <Textarea
            rows={3}
            value={cv.summary}
            onChange={(e) => patch('summary', e.target.value)}
          />
        </Section>

        <SkillsSection skills={cv.skills} onChange={(skills) => patch('skills', skills)} />

        <ExperienceSection
          experience={cv.experience}
          onChange={(experience) => patch('experience', experience)}
        />

        <ProjectsSection
          projects={cv.projects}
          onChange={(projects) => patch('projects', projects)}
        />

        <EducationSection
          education={cv.education}
          onChange={(education) => patch('education', education)}
        />

        <LanguagesSection
          languages={cv.languages}
          onChange={(languages) => patch('languages', languages)}
        />

        <Section title="Interests" hint="Press Enter or comma to add.">
          <TagInput
            value={cv.interests}
            onChange={(interests) => patch('interests', interests)}
            placeholder="Open source, 3D web…"
          />
        </Section>
      </div>

      <footer className="mt-10 pt-6 border-t border-zinc-900 flex items-center justify-end gap-2">
        {dirty && (
          <Button variant="ghost" icon={<RotateCcw size={14} />} onClick={() => load()}>
            Discard
          </Button>
        )}
        <Button icon={<Save size={14} />} onClick={handleSave} loading={saving} disabled={!dirty}>
          Save changes
        </Button>
      </footer>
    </div>
  );
}

/* ─── Section wrapper ──────────────────────────────────────────────────── */

function Section({
  title,
  hint,
  children,
  actions,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <section className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5">
      <header className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100">{title}</h2>
          {hint && <p className="text-[11px] text-zinc-500 mt-0.5">{hint}</p>}
        </div>
        {actions}
      </header>
      {children}
    </section>
  );
}

/* ─── Reusable list item controls ──────────────────────────────────────── */

function ListItemControls({
  index,
  total,
  onMove,
  onRemove,
  label,
}: {
  index: number;
  total: number;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1 shrink-0">
      <button
        type="button"
        onClick={() => onMove(-1)}
        disabled={index === 0}
        aria-label="Move up"
        title="Move up"
        className="p-1.5 text-zinc-500 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer bg-transparent border-none"
      >
        <ArrowUp size={13} />
      </button>
      <button
        type="button"
        onClick={() => onMove(1)}
        disabled={index === total - 1}
        aria-label="Move down"
        title="Move down"
        className="p-1.5 text-zinc-500 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer bg-transparent border-none"
      >
        <ArrowDown size={13} />
      </button>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        title="Remove"
        className="p-1.5 text-zinc-400 hover:text-red-400 cursor-pointer bg-transparent border-none"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}

function moveItem<T>(arr: T[], index: number, dir: -1 | 1): T[] {
  const j = index + dir;
  if (j < 0 || j >= arr.length) return arr;
  const next = [...arr];
  [next[index], next[j]] = [next[j], next[index]];
  return next;
}

/* ─── Hero ─────────────────────────────────────────────────────────────── */

function HeroSection({ hero, onChange }: { hero: CVHero; onChange: (h: CVHero) => void }) {
  function set<K extends keyof CVHero>(key: K, value: CVHero[K]) {
    onChange({ ...hero, [key]: value });
  }
  return (
    <Section title="Hero" hint="Top-of-page contact info.">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Name">
          <Input value={hero.name} onChange={(e) => set('name', e.target.value)} />
        </Field>
        <Field label="Title">
          <Input value={hero.title} onChange={(e) => set('title', e.target.value)} />
        </Field>
        <Field label="Location">
          <Input value={hero.location} onChange={(e) => set('location', e.target.value)} />
        </Field>
        <Field label="Phone">
          <Input value={hero.phone} onChange={(e) => set('phone', e.target.value)} />
        </Field>
        <Field label="Email">
          <Input type="email" value={hero.email} onChange={(e) => set('email', e.target.value)} />
        </Field>
        <Field label="Portfolio URL">
          <Input value={hero.portfolio} onChange={(e) => set('portfolio', e.target.value)} />
        </Field>
        <Field label="LinkedIn">
          <Input value={hero.linkedin} onChange={(e) => set('linkedin', e.target.value)} />
        </Field>
        <Field label="GitHub">
          <Input value={hero.github} onChange={(e) => set('github', e.target.value)} />
        </Field>
      </div>
    </Section>
  );
}

/* ─── Skills ───────────────────────────────────────────────────────────── */

function SkillsSection({
  skills,
  onChange,
}: {
  skills: CVSkillGroup[];
  onChange: (s: CVSkillGroup[]) => void;
}) {
  function update(idx: number, patch: Partial<CVSkillGroup>) {
    onChange(skills.map((g, i) => (i === idx ? { ...g, ...patch } : g)));
  }

  return (
    <Section
      title="Skills"
      hint="Group your skills under labelled buckets (e.g. Frontend, Backend)."
      actions={
        <Button
          variant="secondary"
          icon={<Plus size={13} />}
          onClick={() => onChange([...skills, { label: '', items: [] }])}
        >
          Add group
        </Button>
      }
    >
      {skills.length === 0 ? (
        <p className="text-xs text-zinc-500">No skill groups yet.</p>
      ) : (
        <ul className="space-y-3">
          {skills.map((g, i) => (
            <li key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 flex items-start gap-3">
              <div className="flex-1 grid gap-3 grid-cols-1">
                <Field label="Group label">
                  <Input
                    value={g.label}
                    onChange={(e) => update(i, { label: e.target.value })}
                    placeholder="Frontend"
                  />
                </Field>
                <Field label="Items">
                  <TagInput
                    value={g.items}
                    onChange={(items) => update(i, { items })}
                    placeholder="React, TypeScript…"
                  />
                </Field>
              </div>
              <ListItemControls
                index={i}
                total={skills.length}
                label={g.label || 'group'}
                onMove={(dir) => onChange(moveItem(skills, i, dir))}
                onRemove={() => onChange(skills.filter((_, j) => j !== i))}
              />
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}

/* ─── Experience (CV roles) ────────────────────────────────────────────── */

function ExperienceSection({
  experience,
  onChange,
}: {
  experience: CVRole[];
  onChange: (e: CVRole[]) => void;
}) {
  function update(idx: number, patch: Partial<CVRole>) {
    onChange(experience.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  }

  return (
    <Section
      title="Experience"
      hint="Roles listed on the printable CV. Independent of the public Experience page."
      actions={
        <Button
          variant="secondary"
          icon={<Plus size={13} />}
          onClick={() =>
            onChange([
              ...experience,
              { title: '', company: '', period: '', location: '', bullets: [] },
            ])
          }
        >
          Add role
        </Button>
      }
    >
      {experience.length === 0 ? (
        <p className="text-xs text-zinc-500">No roles yet.</p>
      ) : (
        <ul className="space-y-3">
          {experience.map((r, i) => (
            <li key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 flex items-start gap-3">
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Title">
                    <Input value={r.title} onChange={(e) => update(i, { title: e.target.value })} />
                  </Field>
                  <Field label="Company">
                    <Input value={r.company} onChange={(e) => update(i, { company: e.target.value })} />
                  </Field>
                  <Field label="Period">
                    <Input value={r.period} onChange={(e) => update(i, { period: e.target.value })} />
                  </Field>
                  <Field label="Location">
                    <Input value={r.location} onChange={(e) => update(i, { location: e.target.value })} />
                  </Field>
                </div>
                <Field label="Bullets" hint="One per line.">
                  <Textarea
                    rows={4}
                    value={r.bullets.join('\n')}
                    onChange={(e) =>
                      update(i, {
                        bullets: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                  />
                </Field>
              </div>
              <ListItemControls
                index={i}
                total={experience.length}
                label={r.company || 'role'}
                onMove={(dir) => onChange(moveItem(experience, i, dir))}
                onRemove={() => onChange(experience.filter((_, j) => j !== i))}
              />
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}

/* ─── CV Projects ──────────────────────────────────────────────────────── */

function ProjectsSection({
  projects,
  onChange,
}: {
  projects: CVProject[];
  onChange: (p: CVProject[]) => void;
}) {
  function update(idx: number, patch: Partial<CVProject>) {
    onChange(projects.map((p, i) => (i === idx ? { ...p, ...patch } : p)));
  }

  return (
    <Section
      title="Projects"
      hint="Highlighted projects on the CV. Independent of the live Projects panel."
      actions={
        <Button
          variant="secondary"
          icon={<Plus size={13} />}
          onClick={() => onChange([...projects, { title: '', period: '', blurb: '', tech: [] }])}
        >
          Add project
        </Button>
      }
    >
      {projects.length === 0 ? (
        <p className="text-xs text-zinc-500">No projects yet.</p>
      ) : (
        <ul className="space-y-3">
          {projects.map((p, i) => (
            <li key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 flex items-start gap-3">
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Title">
                    <Input value={p.title} onChange={(e) => update(i, { title: e.target.value })} />
                  </Field>
                  <Field label="Period">
                    <Input value={p.period} onChange={(e) => update(i, { period: e.target.value })} />
                  </Field>
                </div>
                <Field label="Blurb">
                  <Textarea
                    rows={2}
                    value={p.blurb}
                    onChange={(e) => update(i, { blurb: e.target.value })}
                  />
                </Field>
                <Field label="Tech">
                  <TagInput value={p.tech} onChange={(tech) => update(i, { tech })} placeholder="React, …" />
                </Field>
              </div>
              <ListItemControls
                index={i}
                total={projects.length}
                label={p.title || 'project'}
                onMove={(dir) => onChange(moveItem(projects, i, dir))}
                onRemove={() => onChange(projects.filter((_, j) => j !== i))}
              />
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}

/* ─── Education ────────────────────────────────────────────────────────── */

function EducationSection({
  education,
  onChange,
}: {
  education: CVEducation[];
  onChange: (e: CVEducation[]) => void;
}) {
  function update(idx: number, patch: Partial<CVEducation>) {
    onChange(education.map((e, i) => (i === idx ? { ...e, ...patch } : e)));
  }

  return (
    <Section
      title="Education"
      actions={
        <Button
          variant="secondary"
          icon={<Plus size={13} />}
          onClick={() => onChange([...education, { degree: '', school: '', period: '' }])}
        >
          Add
        </Button>
      }
    >
      {education.length === 0 ? (
        <p className="text-xs text-zinc-500">No entries yet.</p>
      ) : (
        <ul className="space-y-3">
          {education.map((e, i) => (
            <li key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 flex items-start gap-3">
              <div className="flex-1 grid grid-cols-3 gap-3">
                <Field label="Degree">
                  <Input value={e.degree} onChange={(ev) => update(i, { degree: ev.target.value })} />
                </Field>
                <Field label="School">
                  <Input value={e.school} onChange={(ev) => update(i, { school: ev.target.value })} />
                </Field>
                <Field label="Period">
                  <Input value={e.period} onChange={(ev) => update(i, { period: ev.target.value })} />
                </Field>
              </div>
              <ListItemControls
                index={i}
                total={education.length}
                label={e.degree || 'entry'}
                onMove={(dir) => onChange(moveItem(education, i, dir))}
                onRemove={() => onChange(education.filter((_, j) => j !== i))}
              />
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}

/* ─── Languages ────────────────────────────────────────────────────────── */

function LanguagesSection({
  languages,
  onChange,
}: {
  languages: CVLanguage[];
  onChange: (l: CVLanguage[]) => void;
}) {
  function update(idx: number, patch: Partial<CVLanguage>) {
    onChange(languages.map((l, i) => (i === idx ? { ...l, ...patch } : l)));
  }

  return (
    <Section
      title="Languages"
      actions={
        <Button
          variant="secondary"
          icon={<Plus size={13} />}
          onClick={() => onChange([...languages, { name: '', level: '' }])}
        >
          Add
        </Button>
      }
    >
      {languages.length === 0 ? (
        <p className="text-xs text-zinc-500">No languages yet.</p>
      ) : (
        <ul className="space-y-3">
          {languages.map((l, i) => (
            <li key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 flex items-start gap-3">
              <div className="flex-1 grid grid-cols-2 gap-3">
                <Field label="Name">
                  <Input value={l.name} onChange={(e) => update(i, { name: e.target.value })} />
                </Field>
                <Field label="Level" hint="e.g. Native, Professional, Conversational">
                  <Input value={l.level} onChange={(e) => update(i, { level: e.target.value })} />
                </Field>
              </div>
              <ListItemControls
                index={i}
                total={languages.length}
                label={l.name || 'language'}
                onMove={(dir) => onChange(moveItem(languages, i, dir))}
                onRemove={() => onChange(languages.filter((_, j) => j !== i))}
              />
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
