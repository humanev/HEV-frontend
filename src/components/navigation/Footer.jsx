import { Link } from "react-router-dom";

const footerColumns = [
  { title: "Platform", links: [["News", "/news"], ["Intelligence", "/intelligence"], ["People", "/people"], ["Ecosystem", "/ecosystem"], ["Magazine", "/magazine"]] },
  { title: "Business", links: [["Directory", "/directory"], ["Startups", "/startups"], ["Investors", "/investors"], ["Research", "/research"], ["Events", "/events"]] },
  { title: "Connect", links: [["About HEV", "/abouthev"], ["Community", "/community"], ["Learning", "/learning"], ["Awards", "/awards"], ["Newsletter", "/newsletter"], ["Membership", "/membership"], ["Contact", "/contact"]] }
];

export default function Footer() {
  return <footer>
    <div className="container footer-grid">
      <div>
        <Link to="/" className="logo footer-logo"><span className="logo-mark">H</span><span>HUMANS <i>of</i> EV</span></Link>
        <p>India’s electric mobility intelligence platform.</p>
        <div className="socials"><span>in</span><span>yt</span><span>𝕏</span><span>ig</span></div>
      </div>
      {footerColumns.map(({ title, links }) => <div key={title}>
        <h4>{title}</h4>
        {links.map(([label, path]) => <Link key={path} to={path}>{label}</Link>)}
      </div>)}
    </div>
    <div className="container footer-bottom">
      <span>© 2026 Humans of EV. All rights reserved.</span>
      <span>Privacy · Terms · Cookie Policy</span>
    </div>
  </footer>;
}
