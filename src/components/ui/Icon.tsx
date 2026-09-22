import {
  BookOpen,
  BrainCircuit,
  Briefcase,
  Building2,
  Cloud,
  Factory,
  FileBarChart,
  FileCheck2,
  Fingerprint,
  FlaskConical,
  Globe2,
  Handshake,
  Landmark,
  LayoutDashboard,
  LifeBuoy,
  Mail,
  Newspaper,
  Radar,
  RadioTower,
  ServerCog,
  ShieldAlert,
  ShieldCheck,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

const registry: Record<string, LucideIcon> = {
  BookOpen,
  BrainCircuit,
  Briefcase,
  Building2,
  Cloud,
  Factory,
  FileBarChart,
  FileCheck2,
  Fingerprint,
  FlaskConical,
  Globe2,
  Handshake,
  Landmark,
  LayoutDashboard,
  LifeBuoy,
  Mail,
  Newspaper,
  Radar,
  RadioTower,
  ServerCog,
  ShieldAlert,
  ShieldCheck,
  Users,
  Zap,
};

export function DynamicIcon({
  name,
  className,
}: {
  name?: string;
  className?: string;
}) {
  if (!name) return null;
  const Icon = registry[name];
  if (!Icon) return null;
  return <Icon className={className} aria-hidden="true" />;
}
