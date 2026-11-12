
import {Link} from "react-router-dom";
import {ArrowUpRight, Newspaper, BarChart3, CarFront, BriefcaseBusiness, Zap, Users, Clapperboard, CalendarDays, Handshake} from "lucide-react";
import {SectionTitle} from "../../../components/common/PageRuntime";

const icons = {Newspaper, BarChart3, CarFront, BriefcaseBusiness, Zap, Users, Clapperboard, CalendarDays, Handshake};

export default function HomeCapabilitiesSection({homeCapabilities}){ return <><section className="dark-section"><div className="container"><SectionTitle kicker="HUMANS OF EV" title="Explore every side of the EV ecosystem." link="/news"/><div className="cap-grid">{homeCapabilities.map(([t,d,p,iconName])=>{const Icon=icons[iconName] || Newspaper;return <Link className="cap" to={p} key={t}><Icon size={25}/><h3>{t}</h3><p>{d}</p><ArrowUpRight size={17}/></Link>})}</div></div></section></>; }
