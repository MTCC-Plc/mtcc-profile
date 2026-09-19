import {
  ArrowDownUp,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  Check,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  FileText,
  FolderClosed,
  Layers3,
  MessageSquareText,
  Network,
  ReceiptText,
  Send,
  UserRound,
  UserRoundCheck,
  UsersRound,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import styles from "./digital-system-visual.module.css";

type DigitalSystem = "pms" | "hris" | "simplix" | "sop" | "vendor";

const systems: Record<DigitalSystem, { name: string; category: string; footer: string }> = {
  pms: { name: "PMS", category: "Project delivery", footer: "One connected view of delivery" },
  hris: { name: "HRIS", category: "Our people", footer: "People and processes, connected" },
  simplix: { name: "Simplix", category: "Executive approvals", footer: "Visibility at every step" },
  sop: { name: "SOP", category: "Shareholder services", footer: "Shareholder services in one place" },
  vendor: { name: "Vendor Portal", category: "Vendor services", footer: "A central point of connection" },
};

function CapabilityRow({ icon: Icon, title, detail }: { icon: LucideIcon; title: string; detail?: string }) {
  return <div className={styles.capability}>
    <span className={styles.smallIcon}><Icon size={18} strokeWidth={1.65} /></span>
    <span><strong>{title}</strong>{detail && <small>{detail}</small>}</span>
    <span className={styles.node} />
  </div>;
}

function ProjectVisual() {
  return <div className={styles.projectDiagram}>
    <div className={styles.projectHub}>
      <div className={styles.layerIcon}><Layers3 size={35} strokeWidth={1.2} /></div>
      <span>Project portfolio</span>
      <div className={styles.hubLines}><i /><i /><i /></div>
    </div>
    <div className={styles.branches}>
      <CapabilityRow icon={ChartNoAxesCombined} title="Monitoring" detail="Portfolio & projects" />
      <CapabilityRow icon={ClipboardCheck} title="Progress & reporting" />
      <CapabilityRow icon={FolderClosed} title="Documentation" detail="Centralised information" />
    </div>
  </div>;
}

function PeopleVisual() {
  return <div className={styles.peopleDiagram}>
    <div className={styles.peopleHub}>
      <span className={styles.peopleOrbit} />
      <span className={styles.orbitPerson}><UserRound size={16} /></span>
      <span className={styles.orbitPerson}><UserRound size={16} /></span>
      <div className={styles.peopleCore}><UsersRound size={35} strokeWidth={1.25} /></div>
      <strong>Our people</strong>
    </div>
    <div className={styles.peopleServices}>
      <CapabilityRow icon={UsersRound} title="Workforce information" />
      <CapabilityRow icon={Workflow} title="Digital HR processes" />
      <CapabilityRow icon={UserRoundCheck} title="Employee services" />
    </div>
  </div>;
}

function ApprovalsVisual() {
  return <div className={styles.approvalsDiagram}>
    <div className={styles.flow}>
      <div className={styles.flowStep}><span><Send size={24} strokeWidth={1.4} /></span><strong>Submitted</strong></div>
      <ArrowRight className={styles.flowArrow} size={21} strokeWidth={1.3} />
      <div className={`${styles.flowStep} ${styles.activeStep}`}><span><FileText size={24} strokeWidth={1.4} /></span><strong>Review</strong></div>
      <ArrowRight className={styles.flowArrow} size={21} strokeWidth={1.3} />
      <div className={styles.flowStep}><span><BadgeCheck size={24} strokeWidth={1.4} /></span><strong>Decision</strong></div>
    </div>
    <div className={styles.approvalDetails}>
      <div><UserRoundCheck size={18} strokeWidth={1.5} /><span>Clear responsibility</span></div>
      <div><Clock3 size={18} strokeWidth={1.5} /><span>Pending duration</span></div>
    </div>
  </div>;
}

const shareholderServices: { icon: LucideIcon; title: string; subtitle: string }[] = [
  { icon: UsersRound, title: "AGM services", subtitle: "Shareholder participation" },
  { icon: UserRoundCheck, title: "Director registration", subtitle: "Digital registration" },
  { icon: ReceiptText, title: "Digital vouchers", subtitle: "Voucher generation" },
  { icon: ArrowDownUp, title: "Share transfers", subtitle: "Transfer services" },
];

function ShareholderVisual() {
  return <div className={styles.serviceGrid}>{shareholderServices.map(({ icon: Icon, title, subtitle }) => <div className={styles.serviceTile} key={title}>
    <Icon size={23} strokeWidth={1.4} />
    <strong>{title}</strong>
    <span>{subtitle}</span>
  </div>)}</div>;
}

function VendorVisual() {
  return <div className={styles.vendorDiagram}>
    <div className={styles.vendorTop}>
      <span className={styles.vendorIcon}><BriefcaseBusiness size={27} strokeWidth={1.4} /></span>
      <div><strong>Vendor Portal</strong><span>Central digital access</span></div>
      <Network className={styles.networkIcon} size={30} strokeWidth={1.15} />
    </div>
    <div className={styles.vendorBranches}>
      <div><FileCheck2 size={23} strokeWidth={1.4} /><strong>Vendor <br />information</strong></div>
      <div><MessageSquareText size={23} strokeWidth={1.4} /><strong>Communication <br />& engagement</strong></div>
      <div><Layers3 size={23} strokeWidth={1.4} /><strong>Vendor <br />services</strong></div>
    </div>
  </div>;
}

/** Conceptual capability diagrams; the surrounding section provides the accessible copy. */
export function DigitalSystemVisual({ system }: { system: DigitalSystem }) {
  const meta = systems[system];

  return <div className={styles.visual} aria-hidden="true">
    <div className={styles.header}><span className={styles.systemName}>{meta.name}</span><span>{meta.category}</span></div>
    <div className={styles.stage}>
      {system === "pms" && <ProjectVisual />}
      {system === "hris" && <PeopleVisual />}
      {system === "simplix" && <ApprovalsVisual />}
      {system === "sop" && <ShareholderVisual />}
      {system === "vendor" && <VendorVisual />}
    </div>
    <div className={styles.footer}><span><Check size={12} strokeWidth={2} />{meta.footer}</span><span>Service overview</span></div>
  </div>;
}
