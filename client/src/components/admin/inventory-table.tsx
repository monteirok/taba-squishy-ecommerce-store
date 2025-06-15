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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnimatedNotification } from "@/components/ui/animated-notification";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Search, Edit, Trash2, Package, AlertTriangle } from "lucide-react";
import type { InventoryItem, InsertInventoryItem } from "@shared/admin-schema";

interface InventoryTableProps {
  inventory: InventoryItem[];
}

export function InventoryTable({ inventory }: InventoryTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [newItem, setNewItem] = useState<InsertInventoryItem>({
    order: "",
    type: "",
    item: "",
    retailPrice: "0.00",
    resellPrice: "0.00",
    stock: 0,
    status: "Available",
    track: "",
    notes: "",
  });
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const queryClient = useQueryClient();

  const createItemMutation = useMutation({
    mutationFn: (data: InsertInventoryItem) => apiRequest("/api/admin/inventory", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/inventory"] });
      setIsAddDialogOpen(false);
      resetForm();
      setNotificationMessage("Inventory item created successfully");
      setShowNotification(true);
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InventoryItem> }) =>
      apiRequest(`/api/admin/inventory/${id}`, "PATCH", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/inventory"] });
      setEditingItem(null);
      setNotificationMessage("Inventory item updated successfully");
      setShowNotification(true);
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/admin/inventory/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/inventory"] });
      setNotificationMessage("Inventory item deleted successfully");
      setShowNotification(true);
    },
  });

  const resetForm = () => {
    setNewItem({
      order: "",
      type: "",
      item: "",
      retailPrice: "0.00",
      resellPrice: "0.00",
      stock: 0,
      status: "Available",
      track: "",
      notes: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateItemMutation.mutate({ id: editingItem.id, data: newItem });
    } else {
      createItemMutation.mutate(newItem);
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setNewItem({
      order: item.order || "",
      type: item.type || "",
      item: item.item,
      retailPrice: item.retailPrice,
      resellPrice: item.resellPrice,
      stock: item.stock,
      status: item.status,
      track: item.track || "",
      notes: item.notes || "",
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this inventory item?")) {
      deleteItemMutation.mutate(id);
    }
  };

  const getStatusBadge = (status: string, stock: number) => {
    if (stock === 0) {
      return <Badge variant="destructive">Sold out</Badge>;
    }
    if (stock <= 1) {
      return <Badge variant="secondary" className="text-orange-600">Low stock</Badge>;
    }
    if (status === "Shipping") {
      return <Badge variant="outline" className="text-blue-600">Shipping</Badge>;
    }
    return <Badge variant="default">Available</Badge>;
  };

  const filteredInventory = inventory.filter(item =>
    item.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.order && item.order.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.type && item.type.toLowerCase().includes(searchQuery.toLowerCase())) ||
    item.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.track && item.track.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalValue = filteredInventory.reduce((sum, item) => sum + (parseFloat(item.retailPrice) * item.stock), 0);
  const lowStockCount = filteredInventory.filter(item => item.stock <= 1 && item.stock > 0).length;
  const soldOutCount = filteredInventory.filter(item => item.stock === 0).length;

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <Search className="w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search inventory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-green-600">
            <Package className="w-3 h-3 mr-1" />
            Value: ${totalValue.toFixed(2)}
          </Badge>
          
          {lowStockCount > 0 && (
            <Badge variant="outline" className="text-orange-600">
              <AlertTriangle className="w-3 h-3 mr-1" />
              {lowStockCount} Low Stock
            </Badge>
          )}
          
          {soldOutCount > 0 && (
            <Badge variant="outline" className="text-red-600">
              {soldOutCount} Sold Out
            </Badge>
          )}
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? "Edit Inventory Item" : "Add New Inventory Item"}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="order">Order</Label>
                    <Input
                      id="order"
                      value={newItem.order}
                      onChange={(e) => setNewItem(prev => ({ ...prev, order: e.target.value }))}
                      placeholder="e.g., GROUP 1, N/A"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select value={newItem.type} onValueChange={(value) => setNewItem(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MAC">MAC</SelectItem>
                        <SelectItem value="HAS">HAS</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="item">Item Name</Label>
                  <Input
                    id="item"
                    value={newItem.item}
                    onChange={(e) => setNewItem(prev => ({ ...prev, item: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="retailPrice">Retail Price</Label>
                    <Input
                      id="retailPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={newItem.retailPrice}
                      onChange={(e) => setNewItem(prev => ({ ...prev, retailPrice: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="resellPrice">Resell Price</Label>
                    <Input
                      id="resellPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={newItem.resellPrice}
                      onChange={(e) => setNewItem(prev => ({ ...prev, resellPrice: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      id="stock"
                      type="number"
                      min="0"
                      value={newItem.stock}
                      onChange={(e) => setNewItem(prev => ({ ...prev, stock: parseInt(e.target.value) }))}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={newItem.status} onValueChange={(value) => setNewItem(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Shipping">Shipping</SelectItem>
                        <SelectItem value="Sold out">Sold out</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="track">Track</Label>
                    <Input
                      id="track"
                      value={newItem.track}
                      onChange={(e) => setNewItem(prev => ({ ...prev, track: e.target.value }))}
                      placeholder="e.g., PARCEL 1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newItem.notes}
                    onChange={(e) => setNewItem(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes..."
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button type="submit" disabled={createItemMutation.isPending || updateItemMutation.isPending}>
                    {editingItem ? "Update" : "Create"} Item
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsAddDialogOpen(false);
                      setEditingItem(null);
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

      {/* Inventory Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Retail Price</TableHead>
              <TableHead>Resell Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Track</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.order || "-"}</TableCell>
                <TableCell>
                  {item.type && (
                    <Badge variant="outline" className="text-xs">
                      {item.type}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="font-medium">{item.item}</TableCell>
                <TableCell>${parseFloat(item.retailPrice).toFixed(2)}</TableCell>
                <TableCell>${parseFloat(item.resellPrice).toFixed(2)}</TableCell>
                <TableCell>
                  <span className={item.stock <= 1 && item.stock > 0 ? "text-orange-600 font-medium" : item.stock === 0 ? "text-red-600 font-medium" : ""}>
                    {item.stock}
                  </span>
                </TableCell>
                <TableCell>
                  {getStatusBadge(item.status, item.stock)}
                </TableCell>
                <TableCell>{item.track || "-"}</TableCell>
                <TableCell className="max-w-xs truncate">{item.notes || "-"}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      disabled={deleteItemMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredInventory.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchQuery ? "No inventory items found matching your search." : "No inventory items yet."}
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