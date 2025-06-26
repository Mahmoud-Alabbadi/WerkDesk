import React, { useState, useEffect } from 'react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Textarea } from '@/components/ui/textarea';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
    import { PlusCircle, Trash2, Save, FileText, XCircle, Languages } from 'lucide-react';
    import { useToast } from "@/components/ui/use-toast";
    import WerkDeskLogo from '@/assets/WerkDeskLogo';
    import { useTranslation } from 'react-i18next';
    import { format } from 'date-fns';
    import { de as deLocale, enUS as enLocale } from 'date-fns/locale';

    const getCompanySettings = () => ({
        name: "WerkDesk Solutions", 
        logoUrl: null, 
        address: "123 Tech Street, Innovation City, TX 75001",
        contact: "support@werkdesk.com | (555) 123-4567"
    });


    const RepairOrderForm = ({ ticket, initialData, onSave, onCancel, onExportPdf, isViewMode = false }) => {
      const { t, i18n } = useTranslation();
      const { toast } = useToast();
      
      const companySettings = getCompanySettings(); 

      const [repairOrder, setRepairOrder] = useState(() => {
        const defaultOrderDate = format(new Date(), 'yyyy-MM-dd');
        const baseData = {
          orderDate: defaultOrderDate,
          customerName: '',
          customerPhone: '',
          reason: '',
          deviceType: '',
          deviceBrand: '',
          deviceModel: '',
          serialOrImei: '',
          deviceColor: '',
          displayCodeOrPassword: '',
          estimatedCost: 0,
          prepayment: 0,
          notes: '',
          partsAndServices: [{ id: Date.now(), description: '', qty: 1, unitPrice: 0, total: 0 }],
          locale: i18n.language,
        };

        if (initialData) {
          return { ...baseData, ...initialData, locale: initialData.locale || i18n.language };
        }
        if (ticket && ticket.id !== t('new_repair_order_id', { defaultValue: 'NEW' })) { 
          return {
            ...baseData,
            customerName: ticket.customer || '',
            customerPhone: ticket.phone || '',
            serialOrImei: ticket.serial || '',
            deviceBrand: ticket.device?.split(' ')[0] || '',
            deviceModel: ticket.device?.split(' ').slice(1).join(' ') || '',
            reason: ticket.summary || '',
            estimatedCost: ticket.price || 0,
            locale: i18n.language,
          };
        }
        return baseData;
      });
      
      useEffect(() => {
        if (initialData) {
          setRepairOrder(prev => ({ ...prev, ...initialData, locale: initialData.locale || i18n.language }));
        } else if (ticket && ticket.id !== t('new_repair_order_id', { defaultValue: 'NEW' })) {
           setRepairOrder(prev => ({
            ...prev,
            customerName: ticket.customer || prev.customerName || '',
            customerPhone: ticket.phone || prev.customerPhone || '',
            serialOrImei: ticket.serial || prev.serialOrImei || '',
            deviceBrand: ticket.device?.split(' ')[0] || prev.deviceBrand || '',
            deviceModel: ticket.device?.split(' ').slice(1).join(' ') || prev.deviceModel || '',
            reason: ticket.summary || prev.reason || '',
            estimatedCost: ticket.price || prev.estimatedCost || 0,
          }));
        }
      }, [initialData, ticket, t]);


      useEffect(() => {
        setRepairOrder(prev => ({ ...prev, locale: i18n.language }));
      }, [i18n.language]);


      const handleInputChange = (e) => {
        if (isViewMode) return;
        const { name, value } = e.target;
        setRepairOrder(prev => ({ ...prev, [name]: value }));
      };

      const handleSelectChange = (name, value) => {
        if (isViewMode) return;
        setRepairOrder(prev => ({ ...prev, [name]: value }));
      };

      const handlePartServiceChange = (index, field, value) => {
        if (isViewMode) return;
        const updatedParts = [...repairOrder.partsAndServices];
        updatedParts[index][field] = value;
        if (field === 'qty' || field === 'unitPrice') {
          updatedParts[index].total = (parseFloat(updatedParts[index].qty) || 0) * (parseFloat(updatedParts[index].unitPrice) || 0);
        }
        setRepairOrder(prev => ({ ...prev, partsAndServices: updatedParts }));
      };

      const addPartServiceRow = () => {
        if (isViewMode) return;
        setRepairOrder(prev => ({
          ...prev,
          partsAndServices: [...prev.partsAndServices, { id: Date.now(), description: '', qty: 1, unitPrice: 0, total: 0 }]
        }));
      };

      const removePartServiceRow = (id) => {
        if (isViewMode) return;
        setRepairOrder(prev => ({
          ...prev,
          partsAndServices: prev.partsAndServices.filter(item => item.id !== id)
        }));
      };

      const calculateGrandTotal = () => {
        return repairOrder.partsAndServices.reduce((sum, item) => sum + (item.total || 0), 0);
      };

      const handleSaveOrder = () => {
        if (isViewMode) return;
        if (!repairOrder.customerName || !repairOrder.deviceType || !repairOrder.reason) {
          toast({ title: t('validation_error'), description: t('customer_device_type_reason_required'), variant: "destructive" });
          return;
        }
        onSave(repairOrder);
      };
      
      const grandTotal = calculateGrandTotal();
      const balanceDue = grandTotal - (parseFloat(repairOrder.prepayment) || 0);
      const currentLocale = repairOrder.locale === 'de' ? deLocale : enLocale;

      return (
        <Card className="w-full mx-auto shadow-lg rounded-lg print:shadow-none" style={{ borderRadius: '8px' }}>
          <CardHeader className="bg-muted/30 p-6 print:bg-transparent rounded-t-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start print:items-center mb-4">
                <div className="flex items-center gap-3 mb-4 sm:mb-0">
                    {companySettings.logoUrl ? <img-replace src={companySettings.logoUrl} alt={`${companySettings.name} Logo`} className="h-12 w-auto print:h-10" /> : <WerkDeskLogo className="h-12 w-12 text-primary print:h-10 print:w-10" />}
                    <div>
                        <CardTitle className="text-2xl font-semibold text-primary print:text-xl" style={{ fontSize: '28px', fontWeight: 600, lineHeight: '1.5'}}>{companySettings.name}</CardTitle>
                        <CardDescription className="text-xs text-muted-foreground print:text-xxs">{companySettings.address} <br/> {companySettings.contact}</CardDescription>
                    </div>
                </div>
                <div className="text-right">
                    <div className="flex items-center justify-end gap-2 mb-1">
                        {!isViewMode && (
                            <Select value={repairOrder.locale} onValueChange={(value) => setRepairOrder(prev => ({...prev, locale: value}))}>
                                <SelectTrigger className="w-[80px] h-8 text-xs print:hidden">
                                    <SelectValue placeholder="Lang" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="en" className="text-xs">EN</SelectItem>
                                    <SelectItem value="de" className="text-xs">DE</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                         <h2 className="text-3xl font-semibold text-primary print:text-2xl" style={{ fontSize: '28px', fontWeight: 600, lineHeight: '1.5'}}>{t('repair_order_form_title')}</h2>
                    </div>
                    {ticket && ticket.id && <p className="text-sm text-muted-foreground print:text-xs">{t('ticket_id')}: {ticket.id}</p>}
                </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-8 print:p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6" style={{gap: '24px'}}>
              <div className="space-y-1.5">
                <Label htmlFor="orderDate" style={{fontSize: '14px', fontWeight: 500}}>{t('order_date')}</Label>
                <Input id="orderDate" name="orderDate" type="date" value={repairOrder.orderDate} onChange={handleInputChange} disabled={isViewMode} className="text-base leading-relaxed" style={{borderRadius: '8px', fontSize: '16px', fontWeight: 400, lineHeight: '1.5'}} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6" style={{gap: '24px'}}>
              <div className="space-y-1.5">
                <Label htmlFor="customerName" style={{fontSize: '14px', fontWeight: 500}}>{t('customer_name')}</Label>
                <Input id="customerName" name="customerName" value={repairOrder.customerName} onChange={handleInputChange} placeholder={t('customer_name_placeholder', {defaultValue: 'e.g., John Doe'})} disabled={isViewMode} className="text-base leading-relaxed" style={{borderRadius: '8px', fontSize: '16px', fontWeight: 400, lineHeight: '1.5'}}/>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="customerPhone" style={{fontSize: '14px', fontWeight: 500}}>{t('customer_phone')}</Label>
                <Input id="customerPhone" name="customerPhone" value={repairOrder.customerPhone} onChange={handleInputChange} placeholder={t('customer_phone_placeholder', {defaultValue: 'e.g., (555) 123-4567'})} disabled={isViewMode} className="text-base leading-relaxed" style={{borderRadius: '8px', fontSize: '16px', fontWeight: 400, lineHeight: '1.5'}}/>
              </div>
            </div>

            <div className="space-y-1.5 mt-8">
              <Label htmlFor="reason" style={{fontSize: '14px', fontWeight: 500}}>{t('reason_for_repair')}</Label>
              <Textarea id="reason" name="reason" value={repairOrder.reason} onChange={handleInputChange} placeholder={t('reason_placeholder', {defaultValue: 'Describe the issue...'})} rows={3} disabled={isViewMode} className="text-base leading-relaxed" style={{borderRadius: '8px', fontSize: '16px', fontWeight: 400, lineHeight: '1.5'}}/>
            </div>

            <fieldset className="border p-6 rounded-lg mt-8" style={{borderRadius: '8px'}}>
              <legend className="text-lg font-semibold px-2 text-primary" style={{fontSize: '20px', fontWeight: 600}}>{t('device_information')}</legend>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6 mt-4" style={{gap: '24px'}}>
                <div className="space-y-1.5">
                  <Label htmlFor="deviceType" style={{fontSize: '14px', fontWeight: 500}}>{t('device_type')}</Label>
                  <Select name="deviceType" value={repairOrder.deviceType} onValueChange={(value) => handleSelectChange('deviceType', value)} disabled={isViewMode}>
                    <SelectTrigger id="deviceType" style={{borderRadius: '8px', fontSize: '16px', fontWeight: 400, lineHeight: '1.5'}} className="text-base leading-relaxed"><SelectValue placeholder={t('select_type_placeholder', {defaultValue: "Select Type"})} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Smartphone">{t('device_type_smartphone', {defaultValue: 'Smartphone'})}</SelectItem>
                      <SelectItem value="Laptop">{t('device_type_laptop', {defaultValue: 'Laptop'})}</SelectItem>
                      <SelectItem value="Tablet">{t('device_type_tablet', {defaultValue: 'Tablet'})}</SelectItem>
                      <SelectItem value="Desktop PC">{t('device_type_desktop', {defaultValue: 'Desktop PC'})}</SelectItem>
                      <SelectItem value="Gaming Console">{t('device_type_console', {defaultValue: 'Gaming Console'})}</SelectItem>
                      <SelectItem value="Other">{t('device_type_other', {defaultValue: 'Other'})}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="deviceBrand" style={{fontSize: '14px', fontWeight: 500}}>{t('brand')}</Label>
                  <Input id="deviceBrand" name="deviceBrand" value={repairOrder.deviceBrand} onChange={handleInputChange} placeholder={t('brand_placeholder', {defaultValue: "e.g., Apple, Samsung"})} disabled={isViewMode} className="text-base leading-relaxed" style={{borderRadius: '8px', fontSize: '16px', fontWeight: 400, lineHeight: '1.5'}}/>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="deviceModel" style={{fontSize: '14px', fontWeight: 500}}>{t('model')}</Label>
                  <Input id="deviceModel" name="deviceModel" value={repairOrder.deviceModel} onChange={handleInputChange} placeholder={t('model_placeholder', {defaultValue: "e.g., iPhone 14 Pro, Galaxy S23"})} disabled={isViewMode} className="text-base leading-relaxed" style={{borderRadius: '8px', fontSize: '16px', fontWeight: 400, lineHeight: '1.5'}}/>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="serialOrImei" style={{fontSize: '14px', fontWeight: 500}}>{t('serial_or_imei')}</Label>
                  <Input id="serialOrImei" name="serialOrImei" value={repairOrder.serialOrImei} onChange={handleInputChange} disabled={isViewMode} className="text-base leading-relaxed" style={{borderRadius: '8px', fontSize: '16px', fontWeight: 400, lineHeight: '1.5'}}/>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="deviceColor" style={{fontSize: '14px', fontWeight: 500}}>{t('device_color')}</Label>
                  <Input id="deviceColor" name="deviceColor" value={repairOrder.deviceColor} onChange={handleInputChange} placeholder={t('color_placeholder', {defaultValue: "e.g., Space Gray"})} disabled={isViewMode} className="text-base leading-relaxed" style={{borderRadius: '8px', fontSize: '16px', fontWeight: 400, lineHeight: '1.5'}}/>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="displayCodeOrPassword" style={{fontSize: '14px', fontWeight: 500}}>{t('display_code_or_password')}</Label>
                  <Input id="displayCodeOrPassword" name="displayCodeOrPassword" value={repairOrder.displayCodeOrPassword} onChange={handleInputChange} placeholder={t('code_placeholder', {defaultValue: "For testing purposes"})} disabled={isViewMode} className="text-base leading-relaxed" style={{borderRadius: '8px', fontSize: '16px', fontWeight: 400, lineHeight: '1.5'}}/>
                </div>
              </div>
            </fieldset>
            
            <div className="space-y-2 mt-8">
                <h4 className="text-lg font-semibold text-primary" style={{fontSize: '20px', fontWeight: 600}}>{t('parts_and_services')}</h4>
                <div className="overflow-x-auto rounded-lg border" style={{borderRadius: '8px'}}>
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead className="w-[40%] text-sm font-medium">{t('description')}</TableHead>
                            <TableHead className="w-[15%] text-sm font-medium">{t('qty')}</TableHead>
                            <TableHead className="w-[20%] text-sm font-medium">{t('unit_price')}</TableHead>
                            <TableHead className="w-[20%] text-sm font-medium">{t('item_total')}</TableHead>
                            <TableHead className="w-[5%] print:hidden text-sm font-medium">{t('actions')}</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {repairOrder.partsAndServices.map((item, index) => (
                            <TableRow key={item.id}>
                            <TableCell>
                                <Input 
                                value={item.description} 
                                onChange={(e) => handlePartServiceChange(index, 'description', e.target.value)}
                                placeholder={t('part_service_desc_placeholder', {defaultValue: "Part or Service Description"})}
                                className="text-base leading-relaxed" style={{borderRadius: '8px', fontSize: '16px', fontWeight: 400, lineHeight: '1.5'}}
                                disabled={isViewMode}
                                />
                            </TableCell>
                            <TableCell>
                                <Input 
                                type="number" 
                                value={item.qty} 
                                onChange={(e) => handlePartServiceChange(index, 'qty', parseFloat(e.target.value))} 
                                className="text-base leading-relaxed w-20" style={{borderRadius: '8px', fontSize: '16px', fontWeight: 400, lineHeight: '1.5'}}
                                min="1"
                                disabled={isViewMode}
                                />
                            </TableCell>
                            <TableCell>
                                <Input 
                                type="number" 
                                value={item.unitPrice} 
                                onChange={(e) => handlePartServiceChange(index, 'unitPrice', parseFloat(e.target.value))} 
                                className="text-base leading-relaxed" style={{borderRadius: '8px', fontSize: '16px', fontWeight: 400, lineHeight: '1.5'}}
                                step="0.01"
                                min="0"
                                disabled={isViewMode}
                                />
                            </TableCell>
                            <TableCell className="text-base font-medium leading-relaxed" style={{fontSize: '16px', fontWeight: 400, lineHeight: '1.5'}}>€{item.total.toFixed(2)}</TableCell>
                            <TableCell className="print:hidden">
                                {!isViewMode && (
                                <Button variant="ghost" size="icon" onClick={() => removePartServiceRow(item.id)} className="text-destructive hover:text-destructive/80">
                                <Trash2 className="h-4 w-4" />
                                </Button>
                                )}
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </div>
                {!isViewMode && (
                    <Button onClick={addPartServiceRow} variant="outline" size="sm" className="mt-4 text-base py-2 print:hidden" style={{borderRadius: '8px'}}>
                        <PlusCircle className="mr-2 h-4 w-4" /> {t('add_item')}
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6 items-end mt-8" style={{gap: '24px'}}>
                <div className="space-y-1.5">
                    <Label htmlFor="estimatedCost" style={{fontSize: '14px', fontWeight: 500}}>{t('estimated_cost')}</Label>
                    <Input id="estimatedCost" name="estimatedCost" type="number" value={repairOrder.estimatedCost} onChange={handleInputChange} placeholder="0.00" step="0.01" disabled={isViewMode} className="text-base leading-relaxed" style={{borderRadius: '8px', fontSize: '16px', fontWeight: 400, lineHeight: '1.5'}}/>
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="prepayment" style={{fontSize: '14px', fontWeight: 500}}>{t('prepayment')}</Label>
                    <Input id="prepayment" name="prepayment" type="number" value={repairOrder.prepayment} onChange={handleInputChange} placeholder="0.00" step="0.01" disabled={isViewMode} className="text-base leading-relaxed" style={{borderRadius: '8px', fontSize: '16px', fontWeight: 400, lineHeight: '1.5'}}/>
                </div>
                <div className="space-y-1 text-right md:col-span-1 mt-4 md:mt-0">
                    <p className="text-sm text-muted-foreground">{t('subtotal_parts_services')}</p>
                    <p className="text-xl font-semibold text-primary" style={{fontSize: '22px'}}>€{grandTotal.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground mt-1">{t('balance_due')}</p>
                    <p className="text-lg font-semibold" style={{fontSize: '18px'}}>€{balanceDue.toFixed(2)}</p>
                </div>
            </div>

            <div className="space-y-1.5 mt-8">
              <Label htmlFor="notes" style={{fontSize: '14px', fontWeight: 500}}>{t('additional_notes')}</Label>
              <Textarea id="notes" name="notes" value={repairOrder.notes} onChange={handleInputChange} placeholder={t('notes_placeholder', {defaultValue: 'Any other relevant information...'})} rows={3} disabled={isViewMode} className="text-base leading-relaxed" style={{borderRadius: '8px', fontSize: '16px', fontWeight: 400, lineHeight: '1.5'}}/>
            </div>

            <div className="mt-8 p-4 border-t border-dashed print:pt-2">
                <h4 className="font-semibold text-sm mb-1" style={{fontSize: '14px', fontWeight: 500}}>{t('terms_conditions_title')}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed" style={{lineHeight: '1.5'}}>
                    {t('terms_conditions_text')}
                </p>
            </div>
            
          </CardContent>
          {!isViewMode && (
          <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-2 p-6 border-t print:hidden">
            <Button variant="outline" onClick={onExportPdf} className="w-full sm:w-auto text-base py-2" style={{borderRadius: '8px'}}>
                <FileText className="mr-2 h-4 w-4" /> {t('export_as_pdf')}
            </Button>
            <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="ghost" onClick={onCancel} className="w-1/2 sm:w-auto text-base py-2" style={{borderRadius: '8px'}}>
                    <XCircle className="mr-2 h-4 w-4" /> {t('cancel')}
                </Button>
                <Button onClick={handleSaveOrder} className="w-1/2 sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground text-base py-2" style={{borderRadius: '8px'}}>
                    <Save className="mr-2 h-4 w-4" /> {t('save_repair_order')}
                </Button>
            </div>
          </CardFooter>
          )}
        </Card>
      );
    };

    export default RepairOrderForm;