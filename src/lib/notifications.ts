import { supabase } from "@/integrations/supabase/client";
import { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['app_role'];

export interface NotificationData {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  user_id?: string;
  target_roles?: UserRole[];
}

export class NotificationService {
  /**
   * Create notifications for specific users
   */
  static async createNotification(data: NotificationData & { user_id: string }) {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: data.user_id,
          title: data.title,
          message: data.message,
          type: data.type,
          read: false
        });

      if (error) {
        console.error('Error creating notification:', error);
        return { success: false, error };
      }

      return { success: true };
    } catch (error) {
      console.error('Error creating notification:', error);
      return { success: false, error };
    }
  }

  /**
   * Create notifications for users with specific roles
   */
  static async createNotificationForRoles(data: NotificationData & { target_roles: UserRole[] }) {
    try {
      // Get all users with the specified roles
      const { data: users, error: fetchError } = await supabase
        .from('user_roles')
        .select('user_id')
        .in('role', data.target_roles);

      if (fetchError) {
        console.error('Error fetching users with roles:', fetchError);
        return { success: false, error: fetchError };
      }

      if (!users || users.length === 0) {
        return { success: true, count: 0 };
      }

      // Create notifications for each user
      const notifications = users.map(user => ({
        user_id: user.user_id,
        title: data.title,
        message: data.message,
        type: data.type,
        read: false
      }));

      const { error: insertError } = await supabase
        .from('notifications')
        .insert(notifications);

      if (insertError) {
        console.error('Error creating notifications:', insertError);
        return { success: false, error: insertError };
      }

      return { success: true, count: notifications.length };
    } catch (error) {
      console.error('Error creating notifications for roles:', error);
      return { success: false, error };
    }
  }

  /**
   * Notify admins and technicians about new service requests
   */
  static async notifyNewServiceRequest(requestData: {
    id: string;
    title: string;
    user_id: string;
    description?: string;
  }) {
    const notificationData = {
      title: 'New Service Request',
      message: `A new service request "${requestData.title}" has been created and requires attention.`,
      type: 'info' as const,
      target_roles: ['admin', 'technician', 'manager'] as UserRole[]
    };

    return await this.createNotificationForRoles(notificationData);
  }

  /**
   * Notify user about service request updates
   */
  static async notifyServiceRequestUpdate(requestData: {
    id: string;
    title: string;
    user_id: string;
    status: string;
    updated_by?: string;
  }) {
    const notificationData = {
      title: 'Service Request Updated',
      message: `Your service request "${requestData.title}" has been updated to status: ${requestData.status}.`,
      type: 'info' as const,
      user_id: requestData.user_id
    };

    return await this.createNotification(notificationData);
  }

  /**
   * Notify about new asset assignments
   */
  static async notifyAssetAssignment(assetData: {
    id: string;
    name: string;
    user_id: string;
    assigned_by?: string;
  }) {
    const notificationData = {
      title: 'Asset Assigned',
      message: `Asset "${assetData.name}" has been assigned to you.`,
      type: 'success' as const,
      user_id: assetData.user_id
    };

    return await this.createNotification(notificationData);
  }

  /**
   * Notify about maintenance schedules
   */
  static async notifyMaintenanceSchedule(maintenanceData: {
    asset_id: string;
    asset_name: string;
    user_id: string;
    scheduled_date: string;
  }) {
    const notificationData = {
      title: 'Maintenance Scheduled',
      message: `Maintenance for asset "${maintenanceData.asset_name}" is scheduled for ${new Date(maintenanceData.scheduled_date).toLocaleDateString()}.`,
      type: 'warning' as const,
      user_id: maintenanceData.user_id
    };

    return await this.createNotification(notificationData);
  }

  /**
   * Notify about system alerts
   */
  static async notifySystemAlert(alertData: {
    title: string;
    message: string;
    severity: 'info' | 'warning' | 'error';
    target_roles?: UserRole[];
  }) {
    if (alertData.target_roles) {
      return await this.createNotificationForRoles({
        title: alertData.title,
        message: alertData.message,
        type: alertData.severity,
        target_roles: alertData.target_roles
      });
    } else {
      // Notify all users
      const { data: users, error } = await supabase
        .from('profiles')
        .select('id');

      if (error || !users) {
        return { success: false, error };
      }

      const notifications = users.map(user => ({
        user_id: user.id,
        title: alertData.title,
        message: alertData.message,
        type: alertData.severity,
        read: false
      }));

      const { error: insertError } = await supabase
        .from('notifications')
        .insert(notifications);

      return { success: !insertError, error: insertError };
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      return { success: !error, error };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return { success: false, error };
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

      return { success: !error, error };
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return { success: false, error };
    }
  }

  /**
   * Get unread notification count for a user
   */
  static async getUnreadCount(userId: string) {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);

      return { count: count || 0, error };
    } catch (error) {
      console.error('Error getting unread count:', error);
      return { count: 0, error };
    }
  }
} 