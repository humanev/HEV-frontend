import {Link} from "react-router-dom";
import {ArrowUpRight, BookOpen, Mic2, Video} from "lucide-react";

import {PageHero, SectionTitle, imgFallback, useManagedContent} from "../../components/common/PageRuntime";
import RelatedPageLinks from "../../components/common/RelatedPageLinks";

const mediaPlacements = {
  magazine: ["page-media", "page-magazine"],
  video: ["page-media", "page-videos"],
  podcast: ["page-media", "page-podcasts"]
};

function MediaPreview({item, kind}) {
  const label = kind === "video" ? "Video" : kind === "podcast" ? "Podcast" : "Magazine";
  return <article className="managed-content-card">
    <img src={item.image || imgFallback} alt="" onError={(event) => { event.currentTarget.src = imgFallback; }}/>
    <div>
      <span className="tag">{label}</span>
      {item.issueLabel && <span className="tag">{item.issueLabel}</span>}
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <RelatedPageLinks item={item}/>
      <Link to={kind === "magazine" ? "/magazine" : kind === "podcast" ? "/podcasts" : "/videos"}>Open {label.toLowerCase()} library <ArrowUpRight size={14}/></Link>
    </div>
  </article>;
}

function MediaSection({id, kicker, title, description, items, error, kind, path, emptyMessage, Icon, muted}) {
  return <section className={`section hev-media-section${muted ? " hev-media-section-muted" : ""}`} id={id}>
    <div className="container">
      <SectionTitle kicker={kicker} title={title} link={path}/>
      <p className="hev-media-description">{description}</p>
      {error
        ? <div className="article-feed-error">{title} could not be loaded: {error}</div>
        : items.length
          ? <div className="managed-content-grid">{items.slice(0, 3).map((item) => <MediaPreview key={`${kind}-${item.id}`} item={item} kind={kind}/>)}</div>
          : <div className="hev-media-empty"><Icon size={28}/><p>{emptyMessage}</p><Link to={path}>Explore {title.toLowerCase()} <ArrowUpRight size={14}/></Link></div>}
    </div>
  </section>;
}

export default function MediaLandingPage() {
  const {items: videos, error: videoError} = useManagedContent("video", mediaPlacements.video);
  const {items: podcasts, error: podcastError} = useManagedContent("podcast", mediaPlacements.podcast);
  const {items: magazines, error: magazineError} = useManagedContent("magazine", mediaPlacements.magazine);

  return <>
    <PageHero kicker="HEV MEDIA" title="Media" desc="Explore the magazine, videos, podcasts and Green Route stories from the people building electric mobility."/>
    <nav className="hev-media-nav container" aria-label="HEV Media sections">
      <a href="#magazine"><BookOpen size={16}/> Magazine</a>
      <a href="#videos"><Video size={16}/> Videos</a>
      <a href="#podcasts"><Mic2 size={16}/> Podcasts</a>
      <a href="#green-route">Green Route <ArrowUpRight size={15}/></a>
    </nav>
    <MediaSection id="magazine" kicker="DIGITAL EDITION" title="Magazine" description="Read long-form stories, visual features and perspectives from across the EV ecosystem." items={magazines} error={magazineError} kind="magazine" path="/magazine" emptyMessage="New magazine issues will appear here when published." Icon={BookOpen}/>
    <MediaSection id="videos" kicker="WATCH" title="Videos" description="Watch interviews, factory visits, panels and product stories from the industry." items={videos} error={videoError} kind="video" path="/videos" emptyMessage="New videos will appear here when published." Icon={Video} muted/>
    <MediaSection id="podcasts" kicker="LISTEN" title="Podcasts" description="Listen to conversations with executives, founders and experts shaping electric mobility." items={podcasts} error={podcastError} kind="podcast" path="/podcasts" emptyMessage="New podcast episodes will appear here when published." Icon={Mic2}/>
    <section className="section hev-media-section hev-media-section-muted" id="green-route">
      <div className="container">
        <div className="hev-green-route">
          <div>
            <span className="eyebrow">GREEN ROUTE</span>
            <h2>Stories for a cleaner journey</h2>
            <p>Discover the people, places and ideas driving change, alongside the energy systems supporting a cleaner future.</p>
          </div>
          <div className="hev-green-route-links">
            <Link className="primary" to="/news/all">Explore the stories <ArrowUpRight size={15}/></Link>
            <Link className="outline" to="/energy">Explore energy <ArrowUpRight size={15}/></Link>
          </div>
        </div>
      </div>
    </section>
  </>;
}
