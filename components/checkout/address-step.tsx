"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, MapPin, Phone, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import AddressForm from "./address-form";
import { formatPhoneNumber } from "@/lib/order-utils";

interface Address {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

interface AddressStepProps {
  selectedAddressId: string | null;
  onAddressSelect: (addressId: string) => void;
  onNext: () => void;
}

export default function AddressStep({
  selectedAddressId,
  onAddressSelect,
  onNext,
}: AddressStepProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await fetch("/api/addresses");
      if (response.ok) {
        const data = await response.json();
        setAddresses(data);

        // Auto-select default address if none selected
        if (!selectedAddressId && data.length > 0) {
          const defaultAddress = data.find((a: Address) => a.isDefault);
          if (defaultAddress) {
            onAddressSelect(defaultAddress.id);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to load addresses");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSuccess = (address: Address) => {
    setAddresses((prev) => [...prev, address]);
    setShowAddForm(false);
    onAddressSelect(address.id);
    toast.success("Address added successfully");
  };

  const handleEditSuccess = (address: Address) => {
    setAddresses((prev) =>
      prev.map((a) => (a.id === address.id ? address : a))
    );
    setEditingAddress(null);
    toast.success("Address updated successfully");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/api/addresses/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete address");
      }

      setAddresses((prev) => prev.filter((a) => a.id !== id));
      if (selectedAddressId === id) {
        onAddressSelect(addresses[0]?.id || "");
      }
      toast.success("Address deleted successfully");
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address");
    } finally {
      setDeletingId(null);
    }
  };

  const handleNext = () => {
    if (!selectedAddressId) {
      toast.error("Please select a shipping address");
      return;
    }
    onNext();
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Shipping Address</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAddForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No addresses saved</h3>
          <p className="text-gray-600 mb-4">
            Add a shipping address to continue
          </p>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Address
          </Button>
        </div>
      ) : (
        <RadioGroup
          value={selectedAddressId || ""}
          onValueChange={onAddressSelect}
          className="space-y-3"
        >
          {addresses.map((address) => (
            <label
              key={address.id}
              className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedAddressId === address.id
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                value={address.id}
                checked={selectedAddressId === address.id}
                onChange={() => onAddressSelect(address.id)}
                className="mt-1 mr-3"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{address.fullName}</span>
                  {address.isDefault && (
                    <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-1">{address.street}</p>
                <p className="text-sm text-gray-600 mb-1">
                  {address.city}, {address.state} {address.postalCode}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {formatPhoneNumber(address.phone)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault();
                    setEditingAddress(address);
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(address.id);
                  }}
                  disabled={deletingId === address.id}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </label>
          ))}
        </RadioGroup>
      )}

      <div className="flex justify-end pt-4">
        <Button onClick={handleNext} disabled={!selectedAddressId} size="lg">
          Continue to Delivery
        </Button>
      </div>

      {/* Add Address Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
          </DialogHeader>
          <AddressForm
            onSuccess={handleAddSuccess}
            onCancel={() => setShowAddForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Address Dialog */}
      <Dialog
        open={!!editingAddress}
        onOpenChange={() => setEditingAddress(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Address</DialogTitle>
          </DialogHeader>
          {editingAddress && (
            <AddressForm
              initialData={editingAddress}
              addressId={editingAddress.id}
              onSuccess={handleEditSuccess}
              onCancel={() => setEditingAddress(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
