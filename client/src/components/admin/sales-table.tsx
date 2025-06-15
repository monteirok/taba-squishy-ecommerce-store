import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AnimatedNotification } from "@/components/ui/animated-notification";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Search, Edit, Trash2, DollarSign } from "lucide-react";
import type { Sale, InsertSale } from "@shared/admin-schema";

interface SalesTableProps {
  sales: Sale[];
}

export function SalesTable({ sales }: SalesTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [newSale, setNewSale] = useState<InsertSale>({
    customer: "",
    item: "",
    qty: 1,
    pricePaid: "0.00",
    pickupDate: "",
    notes: "",
  });
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const queryClient = useQueryClient();

  const createSaleMutation = useMutation({
    mutationFn: (data: InsertSale) => apiRequest("/api/admin/sales", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/sales"] });
      setIsAddDialogOpen(false);
      resetForm();
      setNotificationMessage("Sale created successfully");
      setShowNotification(true);
    },
  });

  const updateSaleMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Sale> }) =>
      apiRequest(`/api/admin/sales/${id}`, "PATCH", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/sales"] });
      setEditingSale(null);
      setNotificationMessage("Sale updated successfully");
      setShowNotification(true);
    },
  });

  const deleteSaleMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/admin/sales/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/sales"] });
      setNotificationMessage("Sale deleted successfully");
      setShowNotification(true);
    },
  });

  const resetForm = () => {
    setNewSale({
      customer: "",
      item: "",
      qty: 1,
      pricePaid: "0.00",
      pickupDate: "",
      notes: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSale) {
      updateSaleMutation.mutate({ id: editingSale.id, data: newSale });
    } else {
      createSaleMutation.mutate(newSale);
    }
  };

  const handleEdit = (sale: Sale) => {
    setEditingSale(sale);
    setNewSale({
      customer: sale.customer,
      item: sale.item,
      qty: sale.qty,
      pricePaid: sale.pricePaid,
      pickupDate: sale.pickupDate || "",
      notes: sale.notes || "",
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this sale?")) {
      deleteSaleMutation.mutate(id);
    }
  };

  const filteredSales = sales.filter(sale =>
    sale.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sale.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (sale.notes && sale.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalRevenue = filteredSales.reduce((sum, sale) => sum + parseFloat(sale.pricePaid), 0);

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <Search className="w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search sales..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-green-600">
            <DollarSign className="w-3 h-3 mr-1" />
            Total: ${totalRevenue.toFixed(2)}
          </Badge>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Sale
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingSale ? "Edit Sale" : "Add New Sale"}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer</Label>
                  <Input
                    id="customer"
                    value={newSale.customer}
                    onChange={(e) => setNewSale(prev => ({ ...prev, customer: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="item">Item</Label>
                  <Input
                    id="item"
                    value={newSale.item}
                    onChange={(e) => setNewSale(prev => ({ ...prev, item: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="qty">Quantity</Label>
                    <Input
                      id="qty"
                      type="number"
                      min="1"
                      value={newSale.qty}
                      onChange={(e) => setNewSale(prev => ({ ...prev, qty: parseInt(e.target.value) }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pricePaid">Price Paid</Label>
                    <Input
                      id="pricePaid"
                      type="number"
                      step="0.01"
                      min="0"
                      value={newSale.pricePaid}
                      onChange={(e) => setNewSale(prev => ({ ...prev, pricePaid: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pickupDate">Pickup Date</Label>
                  <Input
                    id="pickupDate"
                    value={newSale.pickupDate}
                    onChange={(e) => setNewSale(prev => ({ ...prev, pickupDate: e.target.value }))}
                    placeholder="e.g., 6/14/2025"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newSale.notes}
                    onChange={(e) => setNewSale(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes..."
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button type="submit" disabled={createSaleMutation.isPending || updateSaleMutation.isPending}>
                    {editingSale ? "Update" : "Create"} Sale
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsAddDialogOpen(false);
                      setEditingSale(null);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Sales Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Price Paid</TableHead>
              <TableHead>Pickup Date</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell className="font-medium">{sale.customer}</TableCell>
                <TableCell>{sale.item}</TableCell>
                <TableCell>{sale.qty}</TableCell>
                <TableCell>${parseFloat(sale.pricePaid).toFixed(2)}</TableCell>
                <TableCell>{sale.pickupDate || "-"}</TableCell>
                <TableCell className="max-w-xs truncate">{sale.notes || "-"}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(sale)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(sale.id)}
                      disabled={deleteSaleMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredSales.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchQuery ? "No sales found matching your search." : "No sales recorded yet."}
          </div>
        )}
      </div>

      <AnimatedNotification
        type="success"
        title="Success"
        message={notificationMessage}
        isVisible={showNotification}
        onClose={() => setShowNotification(false)}
        autoClose={true}
        duration={3000}
      />
    </div>
  );
}