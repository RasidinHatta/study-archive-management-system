import { Metadata } from 'next';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: "Setting | SAMS",
  description: "A document sharing platform with community discussions",
};

const SettingPage = () => {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Admin Settings</h1>

      {/* Role Management */}
      <Card>
        <CardHeader>
          <CardTitle>Role Management</CardTitle>
        </CardHeader>
        <CardContent>
          Manage user roles and permissions to control access across the platform.
        </CardContent>
      </Card>

      {/* Access Control & Security */}
      <Card>
        <CardHeader>
          <CardTitle>Access Control & Security</CardTitle>
        </CardHeader>
        <CardContent>
          Configure 2FA, session timeout, password policy, and IP restrictions.
        </CardContent>
      </Card>

      {/* System Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>System Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          Set system name, logo, upload limits, and other global preferences.
        </CardContent>
      </Card>

      {/* Email & Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Email & Notification Settings</CardTitle>
        </CardHeader>
        <CardContent>
          Manage SMTP settings and control which email notifications get sent.
        </CardContent>
      </Card>

      {/* Audit Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Logs</CardTitle>
        </CardHeader>
        <CardContent>
          View and export logs of user and admin actions across the system.
        </CardContent>
      </Card>

      {/* Backup & Restore */}
      <Card>
        <CardHeader>
          <CardTitle>Backup & Restore</CardTitle>
        </CardHeader>
        <CardContent>
          Configure automatic backups and restore points for disaster recovery.
        </CardContent>
      </Card>

      {/* API & Developer Settings */}
      <Card>
        <CardHeader>
          <CardTitle>API & Developer Settings</CardTitle>
        </CardHeader>
        <CardContent>
          Manage API keys, rate limits, and webhook configurations.
        </CardContent>
      </Card>

      {/* Appearance & Theming */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance & Theming</CardTitle>
        </CardHeader>
        <CardContent>
          Customize theme, colors, and UI preferences for the admin interface.
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingPage;