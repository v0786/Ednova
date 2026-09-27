export interface NotificationPayload {
  id: string;
  title: string;
  body: string;
  category: 'ATTENDANCE' | 'ASSESSMENT' | 'INCIDENT' | 'ANNOUNCEMENT';
  deepLink: string;
  createdAt: string;
}

export class MobileNotificationClient {
  private deviceToken: string | null = null;
  private permissionGranted: boolean = false;
  private notifications: NotificationPayload[] = [];

  public async registerDeviceToken(token: string): Promise<boolean> {
    this.deviceToken = token;
    this.permissionGranted = true;
    return true;
  }

  public async unregisterDeviceToken(): Promise<boolean> {
    this.deviceToken = null;
    this.permissionGranted = false;
    return true;
  }

  public getDeviceToken(): string | null {
    return this.deviceToken;
  }

  public isPermissionGranted(): boolean {
    return this.permissionGranted;
  }

  public receiveNotification(payload: NotificationPayload): void {
    this.notifications.unshift(payload);
  }

  public getNotifications(): NotificationPayload[] {
    return this.notifications;
  }
}

export const mobileNotificationClient = new MobileNotificationClient();
