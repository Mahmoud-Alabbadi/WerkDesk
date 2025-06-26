import React, { useState, useEffect } from 'react';
    import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
    import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
    import { DatePicker } from "@/components/ui/date-picker";
    import { FileText as RepairOrderIcon, PlusCircle, Search, Filter, ChevronDown, ChevronUp, Edit2, Trash2, Eye, Printer } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { useToast } from "@/components/ui/use-toast";
    import RepairOrderForm from '@/components/RepairOrderForm';
    import { useTranslation } from 'react-i18next';
    import { format } from 'date-fns';
    import { de as deLocale, enUS as enLocale } from 'date-fns/locale';


    const initialRepairOrders = [
      { id: 'T001', date: '2024-05-01', status: 'New', partner: 'TechFix Co.', customer: 'Alice Smith', phone: '555-1234', device: 'iPhone 13', serial: 'SN123XYZ', service: 'Screen Repair', price: 150, summary: 'Cracked screen', repairOrderData: { orderDate: '2024-05-01', customerName: 'Alice Smith', customerPhone: '555-1234', reason: 'Cracked screen', deviceType: 'Smartphone', deviceBrand: 'Apple', deviceModel: 'iPhone 13', serialOrImei: 'SN123XYZ', deviceColor: 'Blue', displayCodeOrPassword: '1234', estimatedCost: 150, prepayment: 50, notes: 'Customer waiting', partsAndServices: [{id: 1, description: 'iPhone 13 Screen Replacement', qty: 1, unitPrice: 120, total: 120}], locale:'en' } },
      { id: 'T002', date: '2024-05-03', status: 'In Progress', partner: 'GadgetPro', customer: 'Bob Johnson', phone: '555-5678', device: 'Samsung S22', serial: 'IMEI456ABC', service: 'Battery Replacement', price: 80, summary: 'Battery drains quickly', repairOrderData: null },
    ];

    const statusColors = {
      'New': 'bg-status-new text-red-800',
      'In Progress': 'bg-status-inprogress text-yellow-800',
      'Ready for Pickup': 'bg-status-ready text-green-800',
      'Cancelled': 'bg-status-cancelled text-blue-800',
    };

    const RepairOrdersPage = () => {
      const { t, i18n } = useTranslation();
      const { toast } = useToast();
      const [repairOrders, setRepairOrders] = useState(() => {
        const savedOrders = localStorage.getItem('werkdeskTickets'); // Still using 'werkdeskTickets' key for now
        return savedOrders ? JSON.parse(savedOrders) : initialRepairOrders;
      });
      const [searchTerm, setSearchTerm] = useState('');
      const [statusFilter, setStatusFilter] = useState('all');
      const [partnerFilter, setPartnerFilter] = useState('all');
      const [dateFilter, setDateFilter] = useState(null);
      const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'descending' });
      
      const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
      const [currentDetailOrder, setCurrentDetailOrder] = useState(null);

      const [isEditRepairOrderModalOpen, setIsEditRepairOrderModalOpen] = useState(false);
      const [editingRepairOrder, setEditingRepairOrder] = useState(null);


      useEffect(() => {
        localStorage.setItem('werkdeskTickets', JSON.stringify(repairOrders));
      }, [repairOrders]);


      const filteredRepairOrders = repairOrders
        .filter(order => 
          (order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
           order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
           order.device.toLowerCase().includes(searchTerm.toLowerCase())) &&
          (statusFilter === 'all' || order.status === statusFilter) &&
          (partnerFilter === 'all' || order.partner === partnerFilter) &&
          (!dateFilter || new Date(order.date).toDateString() === new Date(dateFilter).toDateString())
        )
        .sort((a, b) => {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
          return 0;
        });

      const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
          direction = 'descending';
        }
        setSortConfig({ key, direction });
      };

      const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
          return sortConfig.direction === 'ascending' ? <ChevronUp className="h-4 w-4 inline" /> : <ChevronDown className="h-4 w-4 inline" />;
        }
        return null;
      };
      
      const handleDeleteRepairOrder = (orderId) => {
        setRepairOrders(prev => prev.filter(o => o.id !== orderId));
        toast({ title: t('success'), description: t('ticket_deleted', {ticketId: orderId}), variant: "destructive" });
      };
      
      const orderStats = repairOrders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, { 'New': 0, 'In Progress': 0, 'Ready for Pickup': 0, 'Cancelled': 0 });

      const handleOpenEditRepairOrderModal = (order) => {
        setEditingRepairOrder(order);
        setIsEditRepairOrderModalOpen(true);
        if(isDetailModalOpen) setIsDetailModalOpen(false);
      };

      const handleSaveExistingRepairOrder = (updatedData) => {
        setRepairOrders(prevOrders => prevOrders.map(o => 
          o.id === editingRepairOrder.id ? { ...o, repairOrderData: updatedData, price: updatedData.estimatedCost || o.price, summary: updatedData.reason || o.summary, customer: updatedData.customerName || o.customer, phone: updatedData.customerPhone || o.phone } : o
        ));
        setIsEditRepairOrderModalOpen(false);
        setEditingRepairOrder(null);
        toast({ title: t('success'), description: t('repair_order_updated', {ticketId: editingRepairOrder.id}) });
      };
      
      const handleOpenDetailModal = (order) => {
        setCurrentDetailOrder(order);
        setIsDetailModalOpen(true);
      };

      const handleExportRepairOrderPdf = (orderId) => {
        toast({ title: "PDF Export", description: `PDF export for Repair Order ${orderId} is not yet implemented.`});
        // Logic for PDF export via print as implemented in TicketsPage
        const printableContent = document.getElementById(`repair-order-printable-${orderId}`);
        if (printableContent) {
            const printWindow = window.open('', '_blank');
            printWindow.document.write('<html><head><title>Repair Order</title>');
            const styles = Array.from(document.styleSheets)
              .map(styleSheet => {
                try { return Array.from(styleSheet.cssRules).map(rule => rule.cssText).join(''); } 
                catch (e) { console.warn('Could not read CSS rules:', e); return ''; }
              }).join('');
            printWindow.document.write(`<style>${styles} body { margin: 1.5rem; } .print\\:hidden { display: none !important; }</style></head><body>`);
            printWindow.document.write(printableContent.innerHTML);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            setTimeout(() => { printWindow.print(); }, 500);
        } else {
            toast({ title: t("error"), description: "Printable content not found.", variant: "destructive"});
        }
      };

      const currentLocale = i18n.language === 'de' ? deLocale : enLocale;

      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <Card className="shadow-xl rounded-lg" style={{borderRadius: '8px'}}>
            <CardHeader className="p-6">
              <CardTitle className="flex items-center text-2xl font-semibold" style={{fontSize: '28px', fontWeight: 600, lineHeight: '1.5'}}>
                <RepairOrderIcon className="mr-3 h-7 w-7 text-primary"/>{t('tickets_management')}
              </CardTitle>
              <CardDescription className="text-muted-foreground" style={{lineHeight: '1.5'}}>{t('oversee_repair_orders')}</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                    {Object.entries(orderStats).map(([status, count]) => (
                         <Card key={status} className="hover:shadow-md transition-shadow rounded-lg" style={{borderRadius: '8px'}}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
                                <CardTitle className="text-sm font-medium" style={{fontSize: '14px', fontWeight: 500}}>{t(`status_${status.toLowerCase().replace(' ', '_').replace(/[^a-z0-9_]/gi, '')}`, {defaultValue: status})}</CardTitle>
                                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusColors[status] || 'bg-gray-200 text-gray-800'}`}>
                                    {t(`status_${status.toLowerCase().replace(' ', '_').replace(/[^a-z0-9_]/gi, '')}`, {defaultValue: status})}
                                </span>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="text-2xl font-bold" style={{fontSize: '24px', fontWeight: 600}}>{count}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

              <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-accent/30 rounded-lg border" style={{borderRadius: '8px'}}>
                <div className="flex-grow relative">
                  <Input 
                    placeholder={t('search_repair_orders_placeholder')}
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 text-base leading-relaxed" style={{borderRadius: '8px', fontSize: '16px', fontWeight: 400, lineHeight: '1.5'}}
                  />
                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[180px] text-base leading-relaxed" style={{borderRadius: '8px', fontSize: '16px', fontWeight: 400, lineHeight: '1.5'}}>
                    <SelectValue placeholder={t('filter_by_status')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('all_statuses')}</SelectItem>
                    <SelectItem value="New">{t('status_new')}</SelectItem>
                    <SelectItem value="In Progress">{t('status_in_progress')}</SelectItem>
                    <SelectItem value="Ready for Pickup">{t('status_ready_for_pickup')}</SelectItem>
                    <SelectItem value="Cancelled">{t('status_cancelled')}</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={partnerFilter} onValueChange={setPartnerFilter}>
                  <SelectTrigger className="w-full md:w-[180px] text-base leading-relaxed" style={{borderRadius: '8px', fontSize: '16px', fontWeight: 400, lineHeight: '1.5'}}>
                    <SelectValue placeholder={t('filter_by_partner')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('all_partners')}</SelectItem>
                    <SelectItem value="TechFix Co.">TechFix Co.</SelectItem>
                    <SelectItem value="GadgetPro">GadgetPro</SelectItem>
                    <SelectItem value="RepairHub">RepairHub</SelectItem>
                  </SelectContent>
                </Select>
                <DatePicker date={dateFilter} setDate={setDateFilter} buttonClassName="w-full md:w-auto text-base leading-relaxed" placeholder={t('filter_by_date')} style={{borderRadius: '8px', fontSize: '16px', fontWeight: 400, lineHeight: '1.5'}}/>
                <Button variant="outline" onClick={() => { setSearchTerm(''); setStatusFilter('all'); setPartnerFilter('all'); setDateFilter(null); }} className="text-base py-2" style={{borderRadius: '8px'}}>
                  <Filter className="mr-2 h-4 w-4" /> {t('clear_filters')}
                </Button>
              </div>

              <div className="overflow-x-auto rounded-lg border" style={{borderRadius: '8px'}}>
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      {[t('ticket_id'), t('date'), t('status'), t('partners'), t('customer_name'), t('customer_phone'), t('device_type'), t('serial_or_imei'), t('service'), t('price'), t('preview', {defaultValue: 'Preview'}), t('actions')].map(headerKey => (
                        <TableHead key={headerKey} onClick={() => ![t('actions'), t('preview', {defaultValue: 'Preview'})].includes(headerKey) && requestSort(headerKey.toLowerCase().replace(/ /g, '').replace('(€)',''))} className="cursor-pointer hover:bg-accent whitespace-nowrap text-sm font-medium" style={{fontSize: '14px', fontWeight: 500}}>
                          {headerKey} {[t('actions'), t('preview', {defaultValue: 'Preview'})].includes(headerKey) ? '' : getSortIndicator(headerKey.toLowerCase().replace(/ /g, '').replace('(€)',''))}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                    {filteredRepairOrders.map((order) => (
                      <motion.tr 
                        key={order.id} 
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-accent/50 transition-colors duration-150"
                        onClick={() => handleOpenDetailModal(order)}
                        style={{lineHeight: '1.5'}}
                      >
                        <TableCell className="font-medium text-primary hover:underline cursor-pointer whitespace-nowrap text-sm" style={{fontSize: '16px', fontWeight: 400}}>{order.id}</TableCell>
                        <TableCell className="whitespace-nowrap text-sm" style={{fontSize: '16px', fontWeight: 400}}>{format(new Date(order.date), 'PP', { locale: currentLocale })}</TableCell>
                        <TableCell className="whitespace-nowrap text-sm" style={{fontSize: '16px', fontWeight: 400}}>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[order.status] || 'bg-gray-200 text-gray-800'}`}>
                            {t(`status_${order.status.toLowerCase().replace(' ', '_').replace(/[^a-z0-9_]/gi, '')}`, {defaultValue: order.status})}
                          </span>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-sm" style={{fontSize: '16px', fontWeight: 400}}>{order.partner}</TableCell>
                        <TableCell className="whitespace-nowrap text-sm" style={{fontSize: '16px', fontWeight: 400}}>{order.customer}</TableCell>
                        <TableCell className="whitespace-nowrap text-sm" style={{fontSize: '16px', fontWeight: 400}}>{order.phone}</TableCell>
                        <TableCell className="whitespace-nowrap text-sm" style={{fontSize: '16px', fontWeight: 400}}>{order.device}</TableCell>
                        <TableCell className="whitespace-nowrap text-sm" style={{fontSize: '16px', fontWeight: 400}}>{order.serial}</TableCell>
                        <TableCell className="whitespace-nowrap text-sm" style={{fontSize: '16px', fontWeight: 400}}>{order.service}</TableCell>
                        <TableCell className="whitespace-nowrap text-sm" style={{fontSize: '16px', fontWeight: 400}}>€{order.price.toFixed(2)}</TableCell>
                        <TableCell className="text-sm" style={{fontSize: '16px', fontWeight: 400}}>
                          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleOpenDetailModal(order); }} className="hover:text-primary">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                        <TableCell className="space-x-1 whitespace-nowrap text-sm" style={{fontSize: '16px', fontWeight: 400}}>
                          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleOpenEditRepairOrderModal(order); }} className="hover:text-blue-600">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleDeleteRepairOrder(order.id); }} className="hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </motion.tr>
                    ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
              {filteredRepairOrders.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">{t('no_repair_orders_found')}</div>
              )}
            </CardContent>
             <CardFooter className="pt-6 border-t p-6">
                <p className="text-sm text-muted-foreground" style={{fontSize: '14px', fontWeight: 400}}>{t('total_repair_orders', {count: filteredRepairOrders.length})}</p>
            </CardFooter>
          </Card>

        <AnimatePresence>
          {isDetailModalOpen && currentDetailOrder && (
            <Dialog open={isDetailModalOpen} onOpenChange={() => setIsDetailModalOpen(false)}>
              <DialogContent className="sm:max-w-4xl max-h-[95vh] overflow-y-auto p-0 rounded-lg">
                 <RepairOrderForm 
                    ticket={currentDetailOrder} 
                    initialData={currentDetailOrder.repairOrderData} 
                    onSave={() => {}} // View only, save handled by edit modal
                    onCancel={() => setIsDetailModalOpen(false)}
                    onExportPdf={() => handleExportRepairOrderPdf(currentDetailOrder.id)}
                    isViewMode={true}
                />
                <DialogFooter className="p-6 bg-muted/50 rounded-b-lg sm:justify-between">
                   <Button variant="outline" onClick={() => handleExportRepairOrderPdf(currentDetailOrder.id)} className="text-base py-2" style={{borderRadius: '8px'}}>
                    <Printer className="mr-2 h-4 w-4" /> {t('print_repair_order')}
                  </Button>
                  <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => setIsDetailModalOpen(false)} className="text-base py-2" style={{borderRadius: '8px'}}>{t('cancel')}</Button>
                    <Button onClick={() => handleOpenEditRepairOrderModal(currentDetailOrder)} className="text-base py-2 bg-primary hover:bg-primary/90 text-primary-foreground" style={{borderRadius: '8px'}}>
                        <Edit2 className="mr-2 h-4 w-4" /> {t('edit_auftrag')}
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>

        <AnimatePresence>
            {isEditRepairOrderModalOpen && editingRepairOrder && (
                <Dialog open={isEditRepairOrderModalOpen} onOpenChange={(isOpen) => {
                    if (!isOpen) {
                        setIsEditRepairOrderModalOpen(false);
                        setEditingRepairOrder(null);
                    }
                }}>
                    <DialogContent className="sm:max-w-4xl max-h-[95vh] overflow-y-auto p-0 rounded-lg">
                        <RepairOrderForm 
                            ticket={editingRepairOrder}
                            initialData={editingRepairOrder.repairOrderData}
                            onSave={handleSaveExistingRepairOrder}
                            onCancel={() => { setIsEditRepairOrderModalOpen(false); setEditingRepairOrder(null); }}
                            onExportPdf={() => handleExportRepairOrderPdf(editingRepairOrder.id)}
                        />
                    </DialogContent>
                </Dialog>
            )}
        </AnimatePresence>
        </motion.div>
      );
    };
    export default RepairOrdersPage;