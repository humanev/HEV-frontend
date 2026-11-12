import { useMemo, useState } from "react";
import { Check, Search } from "lucide-react";

export default function PlacementTagPicker({ options, selected, onChange, label = "Where should this appear?", help = "Choose one or more pages. The same content can appear in multiple places without being uploaded again." }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return options.filter((option) => option.label.toLowerCase().includes(search));
  }, [options, query]);
  function toggle(value) {
    onChange(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]);
  }
  return <fieldset className="admin-placement-field">
    <legend>{label}</legend>
    <label className="admin-placement-search"><Search size={15}/><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter pages…" aria-label="Filter page placements"/></label>
    <div className="admin-placement-tags" role="group" aria-label={label}>
      {filtered.map((option) => {
        const isSelected = selected.includes(option.value);
        return <button type="button" key={option.value} className={`admin-placement-tag${isSelected ? " selected" : ""}`} aria-pressed={isSelected} onClick={() => toggle(option.value)}><span>{option.label}</span>{isSelected ? <Check size={14} aria-hidden="true"/> : <b aria-hidden="true">+</b>}</button>;
      })}
      {!filtered.length && <span className="admin-placement-no-results">No pages match “{query}”.</span>}
    </div>
    <small>{help}{selected.length > 0 && ` ${selected.length} page${selected.length === 1 ? "" : "s"} selected.`}</small>
  </fieldset>;
}
