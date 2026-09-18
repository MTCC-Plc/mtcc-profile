import type { Service } from "../types/profile";

/** The original service narratives live with their business, without another overview. */
export function BusinessDetails({ services }: { services?: Service[] }) {
  if (!services?.length) return null;
  return <div className="business-details">
    <p className="eyebrow">Expertise in depth</p>
    {services.map(service => <details className="business-detail" id={service.id} key={service.title}>
      <summary><span>{service.title}</span><span className="business-detail-toggle" aria-hidden="true">+</span></summary>
      <div className="business-detail-content">
        <div className="business-detail-narrative"><p className="business-detail-lead">{service.description}</p>{service.body?.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
        <div className="business-detail-capabilities"><h4>Capabilities</h4><ul>{service.capabilities.map(item => <li key={item}>{item}</li>)}</ul></div>
      </div>
    </details>)}
  </div>;
}
