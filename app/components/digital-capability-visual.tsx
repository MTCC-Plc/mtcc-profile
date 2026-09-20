import { CircleCheck, Database, FileText, LaptopMinimal, UsersRound } from "lucide-react";
import styles from "./digital-capability-visual.module.css";

type CapabilityVariant = "foundations" | "operations" | "services";

const captions: Record<CapabilityVariant, string> = {
  foundations: "Conceptual view; platform relationships are illustrative.",
  operations: "Capability examples shown separately; no integration is implied.",
  services: "Conceptual interface; only confirmed service categories are represented.",
};

function FoundationsVisual() {
  const capabilities = [
    { icon: UsersRound, title: "People & workplace", description: "Connected employee experiences" },
    { icon: FileText, title: "Information & records", description: "Structured and accessible information" },
    { icon: Database, title: "Data & shared services", description: "Reusable enterprise capabilities" },
  ];

  return <>
    <p className={styles.label}>Illustrative capability view</p>
    <div className={styles.foundationsList}>
      {capabilities.map(({ icon: Icon, title, description }) => <div className={styles.capability} key={title}>
        <span className={styles.capabilityIcon}><Icon size={23} strokeWidth={1.8} aria-hidden="true" /></span>
        <div><strong>{title}</strong><p>{description}</p></div>
      </div>)}
    </div>
  </>;
}

function OperationsVisual() {
  return <>
    <p className={styles.label}>Illustrative interfaces</p>
    <div className={styles.workspace}>
      <div className={styles.workspaceHeading}><span>Operational workspace</span><i aria-hidden="true" /></div>
      <div className={styles.projectCard}>
        <div className={styles.cardHeading}><strong>Project overview</strong><span>Delivery</span></div>
        <div className={styles.milestone}><span>Milestone A</span><span className={styles.track} aria-hidden="true"><i style={{ width: "76%" }} /></span><span aria-hidden="true">—</span></div>
        <div className={styles.milestone}><span>Milestone B</span><span className={styles.track} aria-hidden="true"><i style={{ width: "52%" }} /></span><span aria-hidden="true">—</span></div>
      </div>
      <div className={styles.operationCards}>
        <div className={styles.operationCard}>
          <div className={styles.cardHeading}><strong>Maintenance</strong><span>Activities</span></div>
          <div className={styles.activity}><strong>Planned activity</strong><span>Assigned team and schedule</span></div>
        </div>
        <div className={styles.operationCard}>
          <div className={styles.cardHeading}><strong>Approval review</strong><span>Workflow</span></div>
          <div className={styles.activity}><strong>Pending review</strong><span>Responsibility and context</span></div>
        </div>
      </div>
    </div>
  </>;
}

function ServicesVisual() {
  const services = [
    { icon: LaptopMinimal, title: "Customer services" },
    { icon: FileText, title: "Shareholder access" },
    { icon: CircleCheck, title: "Partner engagement" },
  ];

  return <>
    <p className={styles.label}>Illustrative service access</p>
    <div className={styles.servicesStage}>
      <div className={styles.browser}>
        <div className={styles.browserBar} aria-hidden="true"><span /></div>
        <div className={styles.serviceTiles}>
          {services.map(({ icon: Icon, title }) => <div className={styles.serviceTile} key={title}>
            <Icon size={22} strokeWidth={1.7} aria-hidden="true" /><strong>{title}</strong>
          </div>)}
        </div>
      </div>
      <div className={styles.phone}>
        <span className={styles.phoneSpeaker} aria-hidden="true" />
        <div className={styles.phoneScreen}>
          <div>Transport<br />information</div>
          <div>Project<br />information</div>
          <div>Service access</div>
        </div>
      </div>
    </div>
  </>;
}

export function DigitalCapabilityVisual({ variant }: { variant: CapabilityVariant }) {
  return <figure className={styles.figure}>
    <div className={`${styles.frame} ${styles[variant]}`}>
      {variant === "foundations" && <FoundationsVisual />}
      {variant === "operations" && <OperationsVisual />}
      {variant === "services" && <ServicesVisual />}
    </div>
    <figcaption className={styles.caption}>{captions[variant]}</figcaption>
  </figure>;
}
