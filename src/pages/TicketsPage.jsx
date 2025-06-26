import React, { useState, useEffect } from 'react';
    import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
    import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
    import { DatePicker } from "@/components/ui/date-picker";
    import { Briefcase, PlusCircle, Search, Filter, ChevronDown, ChevronUp, Edit2, Trash2, Eye, Printer, FileText } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { useToast } from "@/components/ui/use-toast";
    import RepairOrderForm from '@/components/RepairOrderForm';

    const initialTickets = [
      { id: 'T001', date: '2024-05-01', status: 'New', partner: 'TechFix Co.', customer: 'Alice Smith', phone: '555-1234', device: 'iPhone 13', serial: 'SN123XYZ', service: 'Screen Repair', price: 150, summary: 'Cracked screen', repairOrderData: null },
      { id: 'T002', date: '2024-05-03', status: 'In Progress', partner: 'GadgetPro', customer: 'Bob Johnson', phone: '555-5678', device: 'Samsung S22', serial: 'IMEI456ABC', service: 'Battery Replacement', price: 80, summary: 'Battery drains quickly', repairOrderData: null },
      { id: 'T003', date: '2024-05-05', status: 'Ready for Pickup', partner: 'TechFix Co.', customer: 'Carol Williams', phone: '555-9012', device: 'MacBook Pro', serial: 'MBP789DEF', service: 'Keyboard Clean', price: 50, summary: 'Sticky keys', repairOrderData: null },
      { id: 'T004', date: '2024-05-06', status: 'Cancelled', partner: 'RepairHub', customer: 'David Brown', phone: '555-3456', device: 'Dell XPS 15', serial: 'DXP101GHI', service: 'Data Recovery', price: 200, summary: 'Customer cancelled', repairOrderData: null },
    ];

    const statusColors = {
      'New': 'bg-status-new text-red-800',
      'In Progress': 'bg-status-inprogress text-yellow-800',
      'Ready for Pickup': 'bg-status-ready text-green-800',
      'Cancelled': 'bg-status-cancelled text-blue-800',
    };

    const TicketsPage = () => {
      const { toast } = useToast();
      const [tickets, setTickets] = useState(() => {
        const savedTickets = localStorage.getItem('werkdeskTickets');
        return savedTickets ? JSON.parse(savedTickets) : initialTickets;
      });
      const [searchTerm, setSearchTerm] = useState('');
      const [statusFilter, setStatusFilter] = useState('all');
      const [partnerFilter, setPartnerFilter] = useState('all');
      const [dateFilter, setDateFilter] = useState(null);
      const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'descending' });
      const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
      const [isRepairOrderModalOpen, setIsRepairOrderModalOpen] = useState(false);
      const [editingTicket, setEditingTicket] = useState(null);
      const [ticketForRepairOrder, setTicketForRepairOrder] = useState(null);
      const [detailTicket, setDetailTicket] = useState(null);

      const [newTicketData, setNewTicketData] = useState({
        customer: '', device: '', serial: '', service: '', price: '', summary: ''
      });

      useEffect(() => {
        localStorage.setItem('werkdeskTickets', JSON.stringify(tickets));
      }, [tickets]);

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTicketData(prev => ({ ...prev, [name]: value }));
      };

      const filteredTickets = tickets
        .filter(ticket => 
          (ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
           ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
           ticket.device.toLowerCase().includes(searchTerm.toLowerCase())) &&
          (statusFilter === 'all' || ticket.status === statusFilter) &&
          (partnerFilter === 'all' || ticket.partner === partnerFilter) &&
          (!dateFilter || new Date(ticket.date).toDateString() === new Date(dateFilter).toDateString())
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
      
      const handleSubmitTicket = () => {
        if (!newTicketData.customer || !newTicketData.device || !newTicketData.price) {
            toast({ title: "Validation Error", description: "Customer, Device, and Price are required.", variant: "destructive" });
            return;
        }
        const newId = `T${String(tickets.length + 1).padStart(3, '0')}`;
        const ticketToAdd = { 
            id: newId, 
            date: new Date().toISOString().split('T')[0], 
            status: 'New', 
            partner: 'Self (Admin)', 
            ...newTicketData,
            price: parseFloat(newTicketData.price),
            repairOrderData: null,
        };
        setTickets(prev => [ticketToAdd, ...prev]);
        setIsTicketModalOpen(false);
        setNewTicketData({ customer: '', device: '', serial: '', service: '', price: '', summary: ''});
        toast({ title: "Success!", description: `Ticket ${newId} created successfully.` });
      };

      const handleEditTicket = (ticket) => {
        setEditingTicket(ticket);
        setNewTicketData(ticket);
        setIsTicketModalOpen(true);
      }

      const handleSaveEdit = () => {
         if (!newTicketData.customer || !newTicketData.device || !newTicketData.price) {
            toast({ title: "Validation Error", description: "Customer, Device, and Price are required.", variant: "destructive" });
            return;
        }
        setTickets(prev => prev.map(t => t.id === editingTicket.id ? {...t, ...newTicketData, price: parseFloat(newTicketData.price)} : t));
        setIsTicketModalOpen(false);
        setEditingTicket(null);
        setNewTicketData({ customer: '', device: '', serial: '', service: '', price: '', summary: ''});
        toast({ title: "Success!", description: `Ticket ${editingTicket.id} updated.` });
      }

      const handleDeleteTicket = (ticketId) => {
        setTickets(prev => prev.filter(t => t.id !== ticketId));
        toast({ title: "Deleted", description: `Ticket ${ticketId} has been removed.`, variant: "destructive" });
      }
      
      const ticketStats = tickets.reduce((acc, ticket) => {
        acc[ticket.status] = (acc[ticket.status] || 0) + 1;
        return acc;
      }, { 'New': 0, 'In Progress': 0, 'Ready for Pickup': 0, 'Cancelled': 0 });

      const handleOpenRepairOrderModal = (ticket) => {
        setTicketForRepairOrder(ticket);
        setIsRepairOrderModalOpen(true);
        if (detailTicket) setDetailTicket(null); // Close detail view if open
      };

      const handleSaveRepairOrder = (repairOrderData) => {
        setTickets(prevTickets => prevTickets.map(t => 
          t.id === ticketForRepairOrder.id ? { ...t, repairOrderData } : t
        ));
        setIsRepairOrderModalOpen(false);
        setTicketForRepairOrder(null);
      };

      const handleExportRepairOrderPdf = (ticketId) => {
        // Placeholder for PDF export functionality
        toast({ title: "PDF Export", description: `PDF export for Repair Order ${ticketId} is not yet implemented.`});
        console.log("Exporting PDF for Repair Order of ticket:", ticketId);
        // In a real app, you'd use a library like jsPDF or react-pdf here.
        // For now, we can simulate by opening a new window with the printable content.
        const printableContent = document.getElementById(`repair-order-printable-${ticketId}`);
        if (printableContent) {
            const printWindow = window.open('', '_blank');
            printWindow.document.write('<html><head><title>Repair Order</title>');
            // Add Tailwind styles or a link to your stylesheet
            const styles = Array.from(document.styleSheets)
              .map(styleSheet => {
                try {
                  return Array.from(styleSheet.cssRules)
                    .map(rule => rule.cssText)
                    .join('');
                } catch (e) {
                  console.warn('Could not read CSS rules from stylesheet:', styleSheet.href, e);
                  return '';
                }
              })
              .join('');
            printWindow.document.write(`<style>${styles}</style></head><body class="p-4">`);
            printWindow.document.write(printableContent.innerHTML);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            // Timeout to ensure content is loaded before printing
            setTimeout(() => {
                printWindow.print();
                // printWindow.close(); // Optional: close after printing
            }, 500);
        } else {
            toast({ title: "Error", description: "Printable content not found.", variant: "destructive"});
        }
      };


      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl font-bold">
                <Briefcase className="mr-3 h-7 w-7 text-primary"/>Tickets Management
              </CardTitle>
              <CardDescription>Oversee and manage all repair tickets and their associated repair orders.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                    {Object.entries(ticketStats).map(([status, count]) => (
                         <Card key={status} className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{status}</CardTitle>
                                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusColors[status] || 'bg-gray-200 text-gray-800'}`}>
                                    {status}
                                </span>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{count}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

              <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-accent/30 rounded-lg border">
                <div className="flex-grow relative">
                  <Input 
                    placeholder="Search by Ticket #, Customer, Device..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 text-base"
                  />
                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[180px] text-base">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Ready for Pickup">Ready for Pickup</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={partnerFilter} onValueChange={setPartnerFilter}>
                  <SelectTrigger className="w-full md:w-[180px] text-base">
                    <SelectValue placeholder="Filter by Partner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Partners</SelectItem>
                    <SelectItem value="TechFix Co.">TechFix Co.</SelectItem>
                    <SelectItem value="GadgetPro">GadgetPro</SelectItem>
                    <SelectItem value="RepairHub">RepairHub</SelectItem>
                  </SelectContent>
                </Select>
                <DatePicker date={dateFilter} setDate={setDateFilter} buttonClassName="w-full md:w-auto text-base" placeholder="Filter by Date"/>
                <Button variant="outline" onClick={() => { setSearchTerm(''); setStatusFilter('all'); setPartnerFilter('all'); setDateFilter(null); }} className="text-base">
                  <Filter className="mr-2 h-4 w-4" /> Clear Filters
                </Button>
              </div>

              <Dialog open={isTicketModalOpen} onOpenChange={(isOpen) => {
                setIsTicketModalOpen(isOpen);
                if (!isOpen) {
                    setEditingTicket(null);
                    setNewTicketData({ customer: '', device: '', serial: '', service: '', price: '', summary: ''});
                }
              }}>
                <DialogTrigger asChild>
                  <Button size="lg" className="mb-6 text-base" onClick={() => { setEditingTicket(null); setNewTicketData({ customer: '', device: '', serial: '', service: '', price: '', summary: ''}); setIsTicketModalOpen(true); }}>
                    <PlusCircle className="mr-2 h-5 w-5" /> Add New Ticket
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">{editingTicket ? "Edit Ticket" : "Add New Ticket"}</DialogTitle>
                    <DialogDescription>
                      {editingTicket ? "Update the details for this ticket." : "Fill in the details to create a new ticket."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="customer" className="text-right text-sm">Customer</Label>
                      <Input id="customer" name="customer" value={newTicketData.customer} onChange={handleInputChange} className="col-span-3 text-sm" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="device" className="text-right text-sm">Device</Label>
                      <Input id="device" name="device" value={newTicketData.device} onChange={handleInputChange} className="col-span-3 text-sm" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="serial" className="text-right text-sm">Serial/IMEI</Label>
                      <Input id="serial" name="serial" value={newTicketData.serial} onChange={handleInputChange} className="col-span-3 text-sm" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="service" className="text-right text-sm">Service Type</Label>
                      <Input id="service" name="service" value={newTicketData.service} onChange={handleInputChange} className="col-span-3 text-sm" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="price" className="text-right text-sm">Price (€)</Label>
                      <Input id="price" name="price" type="number" value={newTicketData.price} onChange={handleInputChange} className="col-span-3 text-sm" />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor="summary" className="text-right text-sm pt-2">Summary/Issue</Label>
                      <textarea id="summary" name="summary" value={newTicketData.summary} onChange={handleInputChange} className="col-span-3 text-sm min-h-[80px] border border-input rounded-md p-2 focus-visible:ring-2 focus-visible:ring-ring" />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button type="submit" onClick={editingTicket ? handleSaveEdit : handleSubmitTicket}>{editingTicket ? "Save Changes" : "Create Ticket"}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      {['Ticket #', 'Date', 'Status', 'Partner', 'Customer', 'Phone', 'Device', 'Serial/IMEI', 'Service Type', 'Price (€)', 'Preview', 'Actions'].map(header => (
                        <TableHead key={header} onClick={() => header !== 'Actions' && header !== 'Preview' && requestSort(header.toLowerCase().replace(/ /g, '').replace('(€)',''))} className="cursor-pointer hover:bg-accent whitespace-nowrap text-sm">
                          {header} {header !== 'Actions' && header !== 'Preview' && getSortIndicator(header.toLowerCase().replace(/ /g, '').replace('(€)',''))}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                    {filteredTickets.map((ticket) => (
                      <motion.tr 
                        key={ticket.id} 
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-accent/50 transition-colors duration-150"
                        onClick={() => setDetailTicket(ticket)}
                      >
                        <TableCell className="font-medium text-primary hover:underline cursor-pointer whitespace-nowrap text-sm">{ticket.id}</TableCell>
                        <TableCell className="whitespace-nowrap text-sm">{new Date(ticket.date).toLocaleDateString()}</TableCell>
                        <TableCell className="whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[ticket.status] || 'bg-gray-200 text-gray-800'}`}>
                            {ticket.status}
                          </span>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-sm">{ticket.partner}</TableCell>
                        <TableCell className="whitespace-nowrap text-sm">{ticket.customer}</TableCell>
                        <TableCell className="whitespace-nowrap text-sm">{ticket.phone}</TableCell>
                        <TableCell className="whitespace-nowrap text-sm">{ticket.device}</TableCell>
                        <TableCell className="whitespace-nowrap text-sm">{ticket.serial}</TableCell>
                        <TableCell className="whitespace-nowrap text-sm">{ticket.service}</TableCell>
                        <TableCell className="whitespace-nowrap text-sm">€{ticket.price.toFixed(2)}</TableCell>
                        <TableCell className="text-sm">
                          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setDetailTicket(ticket); }} className="hover:text-primary">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                        <TableCell className="space-x-1 whitespace-nowrap text-sm">
                          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleEditTicket(ticket); }} className="hover:text-blue-600">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleDeleteTicket(ticket.id); }} className="hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </motion.tr>
                    ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
              {filteredTickets.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">No tickets found matching your criteria.</div>
              )}
            </CardContent>
             <CardFooter className="pt-6 border-t">
                <p className="text-sm text-muted-foreground">Total Tickets: {filteredTickets.length}</p>
            </CardFooter>
          </Card>

        <AnimatePresence>
          {detailTicket && (
            <Dialog open={!!detailTicket} onOpenChange={() => setDetailTicket(null)}>
              <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl flex items-center">
                    <Briefcase className="mr-2 h-6 w-6 text-primary" /> Ticket Details: {detailTicket.id}
                  </DialogTitle>
                  <DialogDescription>
                    Full information for ticket {detailTicket.id}.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-6">
                    <Card>
                        <CardHeader><CardTitle className="text-lg">Ticket Information</CardTitle></CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                <div><strong className="font-semibold text-foreground">Date:</strong> <span className="text-muted-foreground">{new Date(detailTicket.date).toLocaleDateString()}</span></div>
                                <div><strong className="font-semibold text-foreground">Status:</strong> <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[detailTicket.status]}`}>{detailTicket.status}</span></div>
                                <div><strong className="font-semibold text-foreground">Partner:</strong> <span className="text-muted-foreground">{detailTicket.partner}</span></div>
                                <div><strong className="font-semibold text-foreground">Customer:</strong> <span className="text-muted-foreground">{detailTicket.customer}</span></div>
                                <div><strong className="font-semibold text-foreground">Phone:</strong> <span className="text-muted-foreground">{detailTicket.phone}</span></div>
                                <div><strong className="font-semibold text-foreground">Device:</strong> <span className="text-muted-foreground">{detailTicket.device}</span></div>
                                <div><strong className="font-semibold text-foreground">Serial/IMEI:</strong> <span className="text-muted-foreground">{detailTicket.serial}</span></div>
                                <div><strong className="font-semibold text-foreground">Service Type:</strong> <span className="text-muted-foreground">{detailTicket.service}</span></div>
                                <div><strong className="font-semibold text-foreground">Price:</strong> <span className="text-muted-foreground">€{detailTicket.price.toFixed(2)}</span></div>
                            </div>
                            <div className="mt-4">
                                <strong className="font-semibold text-foreground">Summary/Issue:</strong>
                                <p className="text-muted-foreground mt-1 p-2 border rounded-md bg-accent/20">{detailTicket.summary}</p>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Repair Order (Auftrag)</CardTitle>
                            <Button size="sm" variant="outline" onClick={() => handleOpenRepairOrderModal(detailTicket)}>
                                {detailTicket.repairOrderData ? <Edit2 className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                                {detailTicket.repairOrderData ? 'Edit Auftrag' : 'Create Auftrag'}
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {detailTicket.repairOrderData ? (
                                <div id={`repair-order-printable-${detailTicket.id}`}>
                                    <RepairOrderForm 
                                        ticket={detailTicket} 
                                        initialData={detailTicket.repairOrderData} 
                                        onSave={() => {}} // View only, save handled by modal
                                        onCancel={() => {}} // View only
                                        onExportPdf={() => handleExportRepairOrderPdf(detailTicket.id)}
                                        isViewMode={true} // Add a prop to disable form fields if needed
                                    />
                                </div>
                            ) : (
                                <p className="text-muted-foreground">No Repair Order (Auftrag) created for this ticket yet.</p>
                            )}
                        </CardContent>
                    </Card>

                </div>
                <DialogFooter className="sm:justify-between">
                  <Button variant="outline" onClick={() => window.print()} className="hidden md:flex">
                    <Printer className="mr-2 h-4 w-4" /> Print Ticket Summary
                  </Button>
                  <div className="flex gap-2">
                    <DialogClose asChild><Button variant="outline">Close</Button></DialogClose>
                    <Button onClick={() => { handleEditTicket(detailTicket); setDetailTicket(null); }}>Edit Ticket Info</Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>

        {/* Repair Order Modal */}
        <AnimatePresence>
            {isRepairOrderModalOpen && ticketForRepairOrder && (
                <Dialog open={isRepairOrderModalOpen} onOpenChange={(isOpen) => {
                    if (!isOpen) {
                        setIsRepairOrderModalOpen(false);
                        setTicketForRepairOrder(null);
                    }
                }}>
                    <DialogContent className="sm:max-w-4xl max-h-[95vh] overflow-y-auto p-0">
                        <RepairOrderForm 
                            ticket={ticketForRepairOrder}
                            initialData={ticketForRepairOrder.repairOrderData}
                            onSave={handleSaveRepairOrder}
                            onCancel={() => { setIsRepairOrderModalOpen(false); setTicketForRepairOrder(null); }}
                            onExportPdf={() => handleExportRepairOrderPdf(ticketForRepairOrder.id)}
                        />
                    </DialogContent>
                </Dialog>
            )}
        </AnimatePresence>
        </motion.div>
      );
    };
    export default TicketsPage;