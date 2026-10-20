export type FileKind =
  | "pdf"
  | "image"
  | "video"
  | "audio"
  | "doc"
  | "sheet"
  | "slides"
  | "form"
  | "archive"
  | "link"
  | "other";

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  kind: FileKind;
  size?: number;
  createdTime?: string;
  modifiedTime?: string;
  description?: string;
  /** Visible to the public (shared "anyone with the link") */
  isPublic: boolean;
  /** Folder names from the root down to the containing folder */
  path: string[];
  /** Id of the top-level folder (one of the four) */
  topFolderId: string;
  parentId: string;
}

export interface DriveFolder {
  id: string;
  name: string;
  description?: string;
  modifiedTime?: string;
  folders: DriveFolder[];
  files: DriveFile[];
}

export type SectionKey = "intro" | "performance" | "requirements" | "evidence";

export interface SectionConfig {
  key: SectionKey;
  title: string;
  subtitle: string;
  /** Drive folder mapped to the section; empty = automatic */
  folderId: string;
  visible: boolean;
  order: number;
}

export interface Achievement {
  id: string;
  title: string;
  date: string;
  category: string;
  description: string;
  url: string;
  order: number;
  visible: boolean;
}

export interface SiteSettings {
  sections: SectionConfig[];
  achievements: Achievement[];
  hiddenFileIds: string[];
  hiddenFolderIds: string[];
  updatedAt?: string;
}

export type DriveStatus =
  | { ok: true; mode: "api-key" | "service-account"; syncedAt: string }
  | { ok: false; reason: "not-configured" | "no-access" | "error"; message: string };

export interface PortfolioData {
  status: DriveStatus;
  root: DriveFolder | null;
  /** All four top-level folders (filtered for public view) */
  topFolders: DriveFolder[];
  sectionFolders: Record<SectionKey, DriveFolder | null>;
  files: DriveFile[];
  settings: SiteSettings;
}

export interface ChecklistItem {
  id: string;
  title: string;
  files: DriveFile[];
  complete: boolean;
  subfolders: number;
}
