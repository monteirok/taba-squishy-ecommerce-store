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
import { Plus, Search, Edit, Trash2, Calendar } from "lucide-react";
import type { Reservation, InsertReservation } from "@shared/admin-schema";

interface ReservationsTableProps {
  reservations: Reservation[];
}

export function ReservationsTable({ reservations }: ReservationsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [newReservation, setNewReservation] = useState<InsertReservation>({
    customer: "",
    item: "",
    pricePaid: "0.00",
    qty: 1,
    dateSold: "",
    notes: "",
  });
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const queryClient = useQueryClient();

  const createReservationMutation = useMutation({
    mutationFn: (data: InsertReservation) => apiRequest("/api/admin/reservations", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reservations"] });
      setIsAddDialogOpen(false);
      resetForm();
      setNotificationMessage("Reservation created successfully");
      setShowNotification(true);
    },
  });

  const updateReservationMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Reservation> }) =>
      apiRequest(`/api/admin/reservations/${id}`, "PATCH", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reservations"] });
      setEditingReservation(null);
      setNotificationMessage("Reservation updated successfully");
      setShowNotification(true);
    },
  });

  const deleteReservationMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/admin/reservations/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reservations"] });
      setNotificationMessage("Reservation deleted successfully");
      setShowNotification(true);
    },
  });

  const resetForm = () => {
    setNewReservation({
      customer: "",
      item: "",
      pricePaid: "0.00",
      qty: 1,
      dateSold: "",
      notes: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingReservation) {
      updateReservationMutation.mutate({ id: editingReservation.id, data: newReservation });
    } else {
      createReservationMutation.mutate(newReservation);
    }
  };

  const handleEdit = (reservation: Reservation) => {
    setEditingReservation(reservation);
    setNewReservation({
      customer: reservation.customer,
      item: reservation.item,
      pricePaid: reservation.pricePaid,
      qty: reservation.qty,
      dateSold: reservation.dateSold || "",
      notes: reservation.notes || "",
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this reservation?")) {
      deleteReservationMutation.mutate(id);
    }
  };

  const filteredReservations = reservations.filter(reservation =>
    reservation.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reservation.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (reservation.notes && reservation.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <Search className="w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search reservations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Reservation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingReservation ? "Edit Reservation" : "Add New Reservation"}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customer">Customer</Label>
                <Input
                  id="customer"
                  value={newReservation.customer}
                  onChange={(e) => setNewReservation(prev => ({ ...prev, customer: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="item">Item</Label>
                <Input
                  id="item"
                  value={newReservation.item}
                  onChange={(e) => setNewReservation(prev => ({ ...prev, item: e.target.value }))}
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
                    value={newReservation.qty}
                    onChange={(e) => setNewReservation(prev => ({ ...prev, qty: parseInt(e.target.value) }))}
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
                    value={newReservation.pricePaid}
                    onChange={(e) => setNewReservation(prev => ({ ...prev, pricePaid: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dateSold">Date Sold</Label>
                <Input
                  id="dateSold"
                  value={newReservation.dateSold}
                  onChange={(e) => setNewReservation(prev => ({ ...prev, dateSold: e.target.value }))}
                  placeholder="e.g., mm/dd/yyyy"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newReservation.notes}
                  onChange={(e) => setNewReservation(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes..."
                />
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" disabled={createReservationMutation.isPending || updateReservationMutation.isPending}>
                  {editingReservation ? "Update" : "Create"} Reservation
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setEditingReservation(null);
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

      {/* Reservations Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Price Paid</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Date Sold</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell className="font-medium">{reservation.customer}</TableCell>
                <TableCell>{reservation.item}</TableCell>
                <TableCell>${parseFloat(reservation.pricePaid).toFixed(2)}</TableCell>
                <TableCell>{reservation.qty}</TableCell>
                <TableCell>{reservation.dateSold || "-"}</TableCell>
                <TableCell className="max-w-xs truncate">{reservation.notes || "-"}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(reservation)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(reservation.id)}
                      disabled={deleteReservationMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredReservations.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchQuery ? "No reservations found matching your search." : "No reservations recorded yet."}
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