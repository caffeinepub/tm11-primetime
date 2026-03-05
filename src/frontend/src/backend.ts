// Auto-generated backend stub for TM11 PrimeTime
// This app uses localStorage - backend calls are stubs only

// ExternalBlob class - must match what config.ts expects
export class ExternalBlob {
  blobId: string;
  url: string;
  mimeType: string;
  onProgress?: (progress: number) => void;

  constructor(blobId: string, url: string, mimeType: string) {
    this.blobId = blobId;
    this.url = url;
    this.mimeType = mimeType;
  }

  static fromURL(url: string): ExternalBlob {
    return new ExternalBlob("", url, "");
  }

  static fromBlob(_blob: Blob): ExternalBlob {
    return new ExternalBlob("", "", "");
  }

  async getBytes(): Promise<Uint8Array> {
    return new Uint8Array();
  }

  toBlob(): Blob {
    return new Blob([], { type: this.mimeType });
  }
}

export interface backendInterface {
  _initializeAccessControlWithSecret: (token: string) => Promise<void>;
  isApproved: () => Promise<boolean>;
  getMyRole: () => Promise<string>;
}

export interface CreateActorOptions {
  agentOptions?: Record<string, unknown>;
  actorOptions?: Record<string, unknown>;
}

export type UploadFileFunction = (file: ExternalBlob) => Promise<Uint8Array>;
export type DownloadFileFunction = (bytes: Uint8Array) => Promise<ExternalBlob>;

export const idlFactory = (): unknown => null;

export const canisterId = "undefined";

// createActor signature: canisterId, uploadFile, downloadFile, options?
export function createActor(
  _canisterId: string,
  _uploadFile?: UploadFileFunction,
  _downloadFile?: DownloadFileFunction,
  _options?: CreateActorOptions
): backendInterface {
  return {
    _initializeAccessControlWithSecret: async () => {},
    isApproved: async () => false,
    getMyRole: async () => "guest",
  };
}
