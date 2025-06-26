import React, { useState } from 'react';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Switch } from '@/components/ui/switch'; 
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { Settings as SettingsIcon, Palette, Bell, Users, UploadCloud, Save, RotateCcw, FileJson, Eye, Edit3 } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { useToast } from "@/components/ui/use-toast";
    import { useAuth } from "@/hooks/useAuth";
    import { useTranslation } from 'react-i18next';

    const SettingsPage = () => {
      const { t } = useTranslation();
      const { toast } = useToast();
      const { role } = useAuth();
      
      // Placeholder state for company info (would come from global context or API)
      const [companyInfo, setCompanyInfo] = useState({
        name: "WerkDesk Solutions",
        logo: null, // File object or URL
        address: "123 Tech Street, Innovation City, TX 75001",
        contact: "support@werkdesk.com | (555) 123-4567",
        primaryColor: '#7C3AED',
        secondaryColor: '#A78BFA'
      });

      const [notificationPrefs, setNotificationPrefs] = useState({ emailNewTicket: true, emailStatusUpdate: true, smsUpdates: false });
      const [userRoles, setUserRoles] = useState([{ id: 'user1', email: 'admin@example.com', role: 'Admin' }, { id: 'user2', email: 'partner@example.com', role: 'Partner' }]);
      const [selectedUser, setSelectedUser] = useState('');
      const [selectedRole, setSelectedRole] = useState('');

      // PDF Template state (very simplified)
      const [pdfTemplateSettings, setPdfTemplateSettings] = useState({
        logoPlacement: 'top-left',
        fontFamily: 'Arial',
        primaryColor: '#7C3AED',
        showFooter: true,
      });


      const handleCompanyInfoChange = (e) => {
        const { name, value, files } = e.target;
        setCompanyInfo(prev => ({ ...prev, [name]: files ? files[0] : value }));
      };

      const handleNotificationChange = (name) => {
        setNotificationPrefs(prev => ({ ...prev, [name]: !prev[name] }));
      };
      
      const handleRoleChange = () => {
        if (!selectedUser || !selectedRole) {
            toast({ title: t('validation_error'), description: t('select_user_and_role'), variant: "destructive"});
            return;
        }
        setUserRoles(prev => prev.map(u => u.id === selectedUser ? { ...u, role: selectedRole} : u));
        toast({ title: t('success'), description: t('user_role_updated', {userEmail: userRoles.find(u=>u.id === selectedUser)?.email}) });
      }

      const handlePdfTemplateChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPdfTemplateSettings(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
      };

      const handleSaveSettings = (section) => {
        // Here you would typically send data to your backend (e.g., Supabase)
        // For now, we just show a toast and potentially update localStorage or a global context
        localStorage.setItem(`werkdesk_${section.toLowerCase().replace(/ /g, '_')}`, JSON.stringify(
          section === 'Portal Branding' ? companyInfo : 
          section === 'Notification Preferences' ? notificationPrefs :
          section === 'Repair Order Template' ? pdfTemplateSettings :
          userRoles
        ));
        toast({ title: t('settings_saved'), description: t('settings_section_updated', {section: t(section.toLowerCase().replace(/ /g, '_'))}) });
      };
      
      const handleResetSettings = (sectionKey) => {
        // Reset logic would depend on how defaults are stored/managed
        if (sectionKey === 'portal_branding') {
          setCompanyInfo({ name: "WerkDesk Solutions", logo: null, address: "123 Tech Street, Innovation City, TX 75001", contact: "support@werkdesk.com | (555) 123-4567", primaryColor: '#7C3AED', secondaryColor: '#A78BFA' });
        }
        if (sectionKey === 'notification_preferences') {
          setNotificationPrefs({ emailNewTicket: true, emailStatusUpdate: true, smsUpdates: false });
        }
        if (sectionKey === 'repair_order_template_editor') {
            setPdfTemplateSettings({ logoPlacement: 'top-left', fontFamily: 'Arial', primaryColor: '#7C3AED', showFooter: true });
        }
        toast({ title: t('settings_reset'), description: t('settings_section_reset', { section: t(sectionKey) }), variant: "default" });
      };


      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-8" // Increased spacing between cards
        >
          <Card className="shadow-xl rounded-lg" style={{borderRadius: '8px'}}>
            <CardHeader className="p-6">
              <CardTitle className="flex items-center text-2xl font-semibold" style={{fontSize: '28px', fontWeight: 600, lineHeight: '1.5'}}>
                <SettingsIcon className="mr-3 h-7 w-7 text-primary"/>{t('application_settings')}
              </CardTitle>
              <CardDescription className="text-muted-foreground" style={{lineHeight: '1.5'}}>{t('customize_werkdesk')}</CardDescription>
            </CardHeader>
          </Card>

          {/* Branding Settings */}
          {role === 'Admin' && (
          <Card className="shadow-lg rounded-lg" style={{borderRadius: '8px'}}>
            <CardHeader className="p-6">
              <CardTitle className="flex items-center text-xl font-semibold" style={{fontSize: '22px', fontWeight: 600, lineHeight: '1.5'}}><Palette className="mr-2 h-5 w-5 text-primary"/>{t('portal_branding')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{gap: '24px'}}>
                <div className="space-y-1.5">
                    <Label htmlFor="companyName" style={{fontSize: '14px', fontWeight: 500}}>{t('company_name', {defaultValue: 'Company Name'})}</Label>
                    <Input id="companyName" name="name" value={companyInfo.name} onChange={handleCompanyInfoChange} className="text-base leading-relaxed" style={{borderRadius: '8px', fontSize: '16px', fontWeight: 400, lineHeight: '1.5'}} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="logoUpload" style={{fontSize: '14px', fontWeight: 500}}>{t('logo_upload')}</Label>
                  <div className="flex items-center gap-4">
                      <Input id="logoUpload" name="logo" type="file" onChange={handleCompanyInfoChange} className="max-w-xs text-sm" style={{borderRadius: '8px', fontSize: '16px', fontWeight: 400, lineHeight: '1.5'}} />
                      {companyInfo.logo && typeof companyInfo.logo === 'object' && <p className="text-sm text-muted-foreground">{companyInfo.logo.name}</p>}
                       <Button variant="outline" size="icon" style={{borderRadius: '8px'}}><UploadCloud className="h-5 w-5"/></Button>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="companyAddress" style={{fontSize: '14px', fontWeight: 500}}>{t('company_address', {defaultValue: 'Address'})}</Label>
                <Input id="companyAddress" name="address" value={companyInfo.address} onChange={handleCompanyInfoChange} className="text-base leading-relaxed" style={{borderRadius: '8px', fontSize: '16px', fontWeight: 400, lineHeight: '1.5'}} />
              </div>
               <div className="space-y-1.5">
                <Label htmlFor="companyContact" style={{fontSize: '14px', fontWeight: 500}}>{t('company_contact', {defaultValue: 'Contact Info'})}</Label>
                <Input id="companyContact" name="contact" value={companyInfo.contact} onChange={handleCompanyInfoChange} className="text-base leading-relaxed" style={{borderRadius: '8px', fontSize: '16px', fontWeight: 400, lineHeight: '1.5'}} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{gap: '24px'}}>
                <div className="space-y-1.5">
                    <Label htmlFor="primaryColor" style={{fontSize: '14px', fontWeight: 500}}>{t('primary_color')}</Label>
                    <Input id="primaryColor" name="primaryColor" type="color" value={companyInfo.primaryColor} onChange={handleCompanyInfoChange} className="h-10 text-sm" style={{borderRadius: '8px'}} />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="secondaryColor" style={{fontSize: '14px', fontWeight: 500}}>{t('secondary_color')}</Label>
                    <Input id="secondaryColor" name="secondaryColor" type="color" value={companyInfo.secondaryColor} onChange={handleCompanyInfoChange} className="h-10 text-sm" style={{borderRadius: '8px'}} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t p-6 flex justify-end gap-2">
                <Button variant="outline" onClick={() => handleResetSettings('portal_branding')} className="text-base py-2" style={{borderRadius: '8px'}}><RotateCcw className="mr-2 h-4 w-4"/> {t('reset')}</Button>
                <Button onClick={() => handleSaveSettings('Portal Branding')} className="text-base py-2 bg-primary hover:bg-primary/90 text-primary-foreground" style={{borderRadius: '8px'}}><Save className="mr-2 h-4 w-4"/> {t('save_branding')}</Button>
            </CardFooter>
          </Card>
          )}

          {/* Repair Order Template Editor */}
          {role === 'Admin' && (
             <Card className="shadow-lg rounded-lg" style={{borderRadius: '8px'}}>
                <CardHeader className="p-6">
                    <CardTitle className="flex items-center text-xl font-semibold" style={{fontSize: '22px', fontWeight: 600, lineHeight: '1.5'}}><FileJson className="mr-2 h-5 w-5 text-primary"/>{t('repair_order_template_editor')}</CardTitle>
                    <CardDescription className="text-muted-foreground" style={{lineHeight: '1.5'}}>{t('customize_pdf_layout')}</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{gap: '24px'}}>
                        <div className="md:col-span-1 space-y-4">
                            <h3 className="text-lg font-medium" style={{fontSize: '18px', fontWeight: 500}}>{t('template_options', { defaultValue: 'Template Options'})}</h3>
                             <div className="space-y-1.5">
                                <Label htmlFor="pdfLogoPlacement" style={{fontSize: '14px', fontWeight: 500}}>{t('logo_placement', { defaultValue: 'Logo Placement'})}</Label>
                                <Select name="logoPlacement" value={pdfTemplateSettings.logoPlacement} onValueChange={(value) => setPdfTemplateSettings(prev => ({...prev, logoPlacement: value}))}>
                                    <SelectTrigger id="pdfLogoPlacement" style={{borderRadius: '8px', fontSize: '16px', fontWeight: 400, lineHeight: '1.5'}}><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="top-left">{t('top_left', { defaultValue: 'Top Left'})}</SelectItem>
                                        <SelectItem value="top-center">{t('top_center', { defaultValue: 'Top Center'})}</SelectItem>
                                        <SelectItem value="top-right">{t('top_right', { defaultValue: 'Top Right'})}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="pdfFontFamily" style={{fontSize: '14px', fontWeight: 500}}>{t('font_family', { defaultValue: 'Font Family'})}</Label>
                                <Select name="fontFamily" value={pdfTemplateSettings.fontFamily} onValueChange={(value) => setPdfTemplateSettings(prev => ({...prev, fontFamily: value}))}>
                                    <SelectTrigger id="pdfFontFamily" style={{borderRadius: '8px', fontSize: '16px', fontWeight: 400, lineHeight: '1.5'}}><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Arial">Arial</SelectItem>
                                        <SelectItem value="Helvetica">Helvetica</SelectItem>
                                        <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                                        <SelectItem value="Verdana">Verdana</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-1.5">
                                <Label htmlFor="pdfPrimaryColor" style={{fontSize: '14px', fontWeight: 500}}>{t('primary_color', { defaultValue: 'Primary Color'})}</Label>
                                <Input id="pdfPrimaryColor" name="primaryColor" type="color" value={pdfTemplateSettings.primaryColor} onChange={handlePdfTemplateChange} className="h-10 text-sm" style={{borderRadius: '8px'}}/>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch id="pdfShowFooter" name="showFooter" checked={pdfTemplateSettings.showFooter} onCheckedChange={(checked) => setPdfTemplateSettings(prev => ({...prev, showFooter: checked}))}/>
                                <Label htmlFor="pdfShowFooter" style={{fontSize: '14px', fontWeight: 500}}>{t('show_footer', { defaultValue: 'Show Footer'})}</Label>
                            </div>
                             <p className="text-sm text-muted-foreground mt-4" style={{lineHeight: '1.5'}}>{t('wysiwyg_placeholder')}</p>
                        </div>
                        <div className="md:col-span-2">
                            <h3 className="text-lg font-medium mb-2" style={{fontSize: '18px', fontWeight: 500}}>{t('live_preview', { defaultValue: 'Live Preview'})}</h3>
                            <div className="border rounded-lg p-4 h-96 bg-gray-50 flex items-center justify-center" style={{borderRadius: '8px'}}>
                                <p className="text-muted-foreground">{t('live_preview_placeholder')}</p>
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4" style={{lineHeight: '1.5'}}>{t('template_management_placeholder')}</p>
                </CardContent>
                 <CardFooter className="border-t p-6 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => handleResetSettings('repair_order_template_editor')} className="text-base py-2" style={{borderRadius: '8px'}}><RotateCcw className="mr-2 h-4 w-4"/> {t('reset')}</Button>
                    <Button onClick={() => handleSaveSettings('Repair Order Template')} className="text-base py-2 bg-primary hover:bg-primary/90 text-primary-foreground" style={{borderRadius: '8px'}}><Save className="mr-2 h-4 w-4"/> {t('save_template', {defaultValue: 'Save Template'})}</Button>
                </CardFooter>
            </Card>
          )}


          {/* Notification Preferences */}
          <Card className="shadow-lg rounded-lg" style={{borderRadius: '8px'}}>
            <CardHeader className="p-6">
              <CardTitle className="flex items-center text-xl font-semibold" style={{fontSize: '22px', fontWeight: 600, lineHeight: '1.5'}}><Bell className="mr-2 h-5 w-5 text-primary"/>{t('notification_preferences')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center justify-between p-4 rounded-md border hover:bg-accent/30" style={{borderRadius: '8px'}}>
                <Label htmlFor="emailNewTicket" className="text-base cursor-pointer" style={{fontSize: '16px', fontWeight: 400, lineHeight: '1.5'}}>{t('email_on_new_ticket')}</Label>
                <Switch id="emailNewTicket" checked={notificationPrefs.emailNewTicket} onCheckedChange={() => handleNotificationChange('emailNewTicket')} />
              </div>
              <div className="flex items-center justify-between p-4 rounded-md border hover:bg-accent/30" style={{borderRadius: '8px'}}>
                <Label htmlFor="emailStatusUpdate" className="text-base cursor-pointer" style={{fontSize: '16px', fontWeight: 400, lineHeight: '1.5'}}>{t('email_on_status_update')}</Label>
                <Switch id="emailStatusUpdate" checked={notificationPrefs.emailStatusUpdate} onCheckedChange={() => handleNotificationChange('emailStatusUpdate')} />
              </div>
              <div className="flex items-center justify-between p-4 rounded-md border hover:bg-accent/30" style={{borderRadius: '8px'}}>
                <Label htmlFor="smsUpdates" className="text-base cursor-pointer" style={{fontSize: '16px', fontWeight: 400, lineHeight: '1.5'}}>{t('sms_for_urgent')}</Label>
                <Switch id="smsUpdates" checked={notificationPrefs.smsUpdates} onCheckedChange={() => handleNotificationChange('smsUpdates')} />
              </div>
            </CardContent>
            <CardFooter className="border-t p-6 flex justify-end gap-2">
                <Button variant="outline" onClick={() => handleResetSettings('notification_preferences')} className="text-base py-2" style={{borderRadius: '8px'}}><RotateCcw className="mr-2 h-4 w-4"/> {t('reset')}</Button>
                <Button onClick={() => handleSaveSettings('Notification Preferences')} className="text-base py-2 bg-primary hover:bg-primary/90 text-primary-foreground" style={{borderRadius: '8px'}}><Save className="mr-2 h-4 w-4"/> {t('save_notifications')}</Button>
            </CardFooter>
          </Card>

          {/* User Management - Admin Only */}
          {role === 'Admin' && (
            <Card className="shadow-lg rounded-lg" style={{borderRadius: '8px'}}>
              <CardHeader className="p-6">
                <CardTitle className="flex items-center text-xl font-semibold" style={{fontSize: '22px', fontWeight: 600, lineHeight: '1.5'}}><Users className="mr-2 h-5 w-5 text-primary"/>{t('user_roles_management')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end" style={{gap: '24px'}}>
                    <div className="space-y-1.5">
                        <Label htmlFor="userSelect" style={{fontSize: '14px', fontWeight: 500}}>{t('select_user')}</Label>
                        <Select value={selectedUser} onValueChange={setSelectedUser}>
                            <SelectTrigger id="userSelect" className="text-base leading-relaxed" style={{borderRadius: '8px', fontSize: '16px', fontWeight: 400, lineHeight: '1.5'}}><SelectValue placeholder={t('select_user_placeholder', {defaultValue: 'Select a user email'})} /></SelectTrigger>
                            <SelectContent>
                                {userRoles.map(user => <SelectItem key={user.id} value={user.id} className="text-sm">{user.email} ({user.role})</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="roleSelect" style={{fontSize: '14px', fontWeight: 500}}>{t('assign_role')}</Label>
                        <Select value={selectedRole} onValueChange={setSelectedRole}>
                            <SelectTrigger id="roleSelect" className="text-base leading-relaxed" style={{borderRadius: '8px', fontSize: '16px', fontWeight: 400, lineHeight: '1.5'}}><SelectValue placeholder={t('select_role_placeholder', {defaultValue: 'Select a role'})} /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Admin">Admin</SelectItem>
                                <SelectItem value="Partner">Partner</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={handleRoleChange} className="w-full md:w-auto text-base py-2 bg-primary hover:bg-primary/90 text-primary-foreground" style={{borderRadius: '8px'}}>{t('update_role')}</Button>
                </div>
                <div className="border rounded-lg p-4 max-h-60 overflow-y-auto" style={{borderRadius: '8px'}}>
                    <h4 className="font-semibold mb-2 text-md" style={{fontSize: '18px', fontWeight: 500}}>{t('current_users')}</h4>
                    <ul className="space-y-1">
                        {userRoles.map(user => (
                            <li key={user.id} className="text-sm text-muted-foreground flex justify-between" style={{fontSize: '16px', fontWeight: 400, lineHeight: '1.5'}}>
                                <span>{user.email}</span>
                                <span className={`font-medium ${user.role === 'Admin' ? 'text-primary' : 'text-green-600'}`}>{user.role}</span>
                            </li>
                        ))}
                    </ul>
                </div>
              </CardContent>
              <CardFooter className="border-t p-6 flex justify-end">
                <Button onClick={() => handleSaveSettings('User Roles')} className="text-base py-2 bg-primary hover:bg-primary/90 text-primary-foreground" style={{borderRadius: '8px'}}><Save className="mr-2 h-4 w-4"/> {t('save_user_roles')}</Button>
              </CardFooter>
            </Card>
          )}

        </motion.div>
      );
    };
    export default SettingsPage;