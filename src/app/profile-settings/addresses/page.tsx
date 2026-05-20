"use client";

import { FormEvent, useState } from "react";
import { ExternalLink, MapPin, Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type Address = {
  id: string;
  title: string;
  fullAddress: string;
};

const initialAddresses: Address[] = [
  { id: "home", title: "Home", fullAddress: "124 Bay Street, Downtown Toronto, ON M5J 2X8, Canada" },
  { id: "office", title: "Office", fullAddress: "250 Yonge Street, Toronto, ON M5B 2L7, Canada" },
];

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    title: "",
    address: "",
    streetName: "",
    houseApartment: "",
    zipCode: "",
  });

  const onSubmitAddress = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fullAddress = [
      newAddress.address,
      newAddress.streetName,
      newAddress.houseApartment,
      newAddress.zipCode,
    ]
      .filter(Boolean)
      .join(", ");

    if (!newAddress.title || !fullAddress) {
      return;
    }

    setAddresses((current) => [
      ...current,
      {
        id: `${newAddress.title.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
        title: newAddress.title,
        fullAddress,
      },
    ]);
    setNewAddress({
      title: "",
      address: "",
      streetName: "",
      houseApartment: "",
      zipCode: "",
    });
    setIsAddAddressOpen(false);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[21px] font-[700] leading-7 text-black">Address</h2>
        <Dialog open={isAddAddressOpen} onOpenChange={setIsAddAddressOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-2 text-[16px] font-[500] leading-5 text-[#005864] underline underline-offset-2"
            >
              <Plus className="h-4 w-4" />
              Add Address
            </button>
          </DialogTrigger>
          <DialogContent
            showCloseButton={false}
            className="max-w-[525px] rounded-[12px] bg-white p-10"
          >
            <DialogHeader className="gap-1">
              <DialogTitle className="text-[28px] font-[700] leading-[35px] tracking-[-0.018em] text-[#181818]">
                Add Address
              </DialogTitle>
            </DialogHeader>

            <DialogClose asChild>
              <button
                type="button"
                className="absolute right-7 top-8 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-[#181818] transition hover:bg-[#F3F3F3]"
              >
                <X className="h-5 w-5" />
              </button>
            </DialogClose>

            <form className="mt-1 space-y-[15px]" onSubmit={onSubmitAddress}>
              <div>
                <label htmlFor="address-title" className="mb-2 block text-[14px] font-[500] text-[#181818]">
                  Address Name
                </label>
                <Input
                  id="address-title"
                  value={newAddress.title}
                  onChange={(event) => setNewAddress((prev) => ({ ...prev, title: event.target.value }))}
                  placeholder="Office"
                  className="h-12 rounded-[12px] border-[#005864] bg-[#F8F8F8] text-[14px]"
                  required
                />
              </div>

              <div>
                <label htmlFor="address" className="mb-2 block text-[14px] font-[500] text-[#181818]">
                  Address
                </label>
                <Input
                  id="address"
                  value={newAddress.address}
                  onChange={(event) => setNewAddress((prev) => ({ ...prev, address: event.target.value }))}
                  placeholder="124 Bay Street, Downtown Toronto, ON M5J 2X8, Canada"
                  className="h-12 rounded-[12px] border-[#005864] bg-[#F8F8F8] text-[14px]"
                  required
                />
              </div>

              <div>
                <label htmlFor="street-name" className="mb-2 block text-[14px] font-[500] text-[#181818]">
                  Street Name
                </label>
                <Input
                  id="street-name"
                  value={newAddress.streetName}
                  onChange={(event) =>
                    setNewAddress((prev) => ({ ...prev, streetName: event.target.value }))
                  }
                  placeholder="Bay Street"
                  className="h-12 rounded-[12px] border-[#005864] bg-white text-[14px]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-[10px]">
                <div>
                  <label
                    htmlFor="house-apartment"
                    className="mb-2 block text-[14px] font-[500] text-[#181818]"
                  >
                    House/Apartment
                  </label>
                  <Input
                    id="house-apartment"
                    value={newAddress.houseApartment}
                    onChange={(event) =>
                      setNewAddress((prev) => ({ ...prev, houseApartment: event.target.value }))
                    }
                    placeholder="e.g., 67"
                    className="h-12 rounded-[12px] border-[#005864] bg-white text-[14px]"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="zip-code" className="mb-2 block text-[14px] font-[500] text-[#181818]">
                    Zip Code*
                  </label>
                  <Input
                    id="zip-code"
                    value={newAddress.zipCode}
                    onChange={(event) => setNewAddress((prev) => ({ ...prev, zipCode: event.target.value }))}
                    placeholder="e.g., 3456"
                    className="h-12 rounded-[12px] border-[#005864] bg-white text-[14px]"
                    required
                  />
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[8px] bg-[#D9D9D9] p-3">
                <div className="h-[88px] rounded-[8px] bg-[radial-gradient(circle_at_70%_35%,#404040_0%,#202020_30%,#111111_60%)]" />
                <button
                  type="button"
                  className="absolute left-1/2 top-1/2 flex h-14 w-14 cursor-pointer -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#181818] text-white"
                >
                  <Upload className="h-5 w-5" />
                </button>
              </div>

              <div>
                <Button
                  type="submit"
                  className="h-12 w-full cursor-pointer rounded-[12px] bg-[#005864] text-[16px] font-[600] text-white hover:bg-[#004d57]"
                >
                  Save Address
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-6 space-y-4">
        {addresses.map((address) => (
          <article key={address.id} className="rounded-[12px] bg-white p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="max-w-[520px]">
                <h3 className="text-[20px] font-[500] leading-[26px] text-[#1F1F1F]">
                  {address.title}
                </h3>
                <div className="mt-3 flex items-start gap-2">
                  <MapPin className="mt-1 h-[17px] w-[17px] shrink-0 text-[#1F1F1F]" />
                  <p className="text-[15px] leading-5 text-black/60">{address.fullAddress}</p>
                </div>
                <button
                  type="button"
                  className="mt-2 inline-flex cursor-pointer items-center gap-1 text-[14px] font-[500] leading-[18px] text-[#005864] underline underline-offset-2"
                >
                  View on Map
                  <ExternalLink className="h-[14px] w-[14px]" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label={`Edit ${address.title} address`}
                  className="flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-[6px] text-black transition hover:bg-[#F3F3F3]"
                >
                  <Pencil className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${address.title} address`}
                  className="flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-[6px] text-[#FF5D5D] transition hover:bg-[#FFF1F1]"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
