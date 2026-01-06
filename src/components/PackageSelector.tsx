import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useState, useEffect } from "react";

interface PackageOption {
  id: string;
  name: string;
  price: number;
  description: string;
}

const packages: PackageOption[] = [
  {
    id: "contest",
    name: "Contest",
    price: 350000,
    description: "",
  },
  {
    id: "meetup",
    name: "Meet Up",
    price: 150000,
    description: "",
  },
];

interface PackageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  categoryCount?: number; // Number of categories selected
}

export function PackageSelector({ value, onChange, className, disabled = false, categoryCount = 0 }: PackageSelectorProps) {
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);

  useEffect(() => {
    // Parse value to array if it contains both packages
    if (value.includes(',')) {
      setSelectedPackages(value.split(','));
    } else if (value) {
      setSelectedPackages([value]);
    } else {
      setSelectedPackages([]);
    }
  }, [value]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handlePackageClick = (pkgId: string) => {
    if (disabled) return;

    let newSelected = [...selectedPackages];
    
    if (pkgId === "meetup") {
      // Meet Up hanya bisa dipilih jika Contest sudah dipilih
      if (!newSelected.includes("contest")) {
        return; // Tidak bisa pilih Meet Up tanpa Contest
      }
      
      if (newSelected.includes("meetup")) {
        // Jika sudah dipilih, hapus Meet Up
        newSelected = newSelected.filter(id => id !== "meetup");
      } else {
        // Tambah Meet Up
        newSelected.push("meetup");
      }
    } else if (pkgId === "contest") {
      if (newSelected.includes("contest")) {
        // Jika Contest di-uncheck, hapus juga Meet Up
        newSelected = [];
      } else {
        // Tambah Contest
        newSelected = ["contest"];
      }
    }

    setSelectedPackages(newSelected);
    onChange(newSelected.join(','));
  };

  const calculateTotal = () => {
    let total = 0;
    selectedPackages.forEach(pkgId => {
      const pkg = packages.find(p => p.id === pkgId);
      if (pkg) {
        if (pkg.id === "contest") {
          // Contest price is multiplied by number of categories
          // 1 category = 350k, 2 categories = 700k, 3 categories = 1.050k
          const contestPrice = pkg.price * Math.max(1, categoryCount);
          total += contestPrice;
        } else {
          // Meet Up price is fixed
          total += pkg.price;
        }
      }
    });
    return total;
  };

  const getContestPrice = () => {
    const contestPkg = packages.find(p => p.id === "contest");
    if (!contestPkg) return 0;
    return contestPkg.price * Math.max(1, categoryCount);
  };

  const isPackageSelected = (pkgId: string) => {
    return selectedPackages.includes(pkgId);
  };

  const isMeetUpDisabled = () => {
    return disabled || !selectedPackages.includes("contest");
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Package Options */}
      <div className="grid gap-3">
        {packages.map((pkg) => {
          // Sembunyikan Meet Up jika Contest belum dipilih
          if (pkg.id === "meetup" && !selectedPackages.includes("contest")) {
            return null;
          }

          const isSelected = isPackageSelected(pkg.id);
          const isDisabled = disabled || (pkg.id === "meetup" && isMeetUpDisabled());
          
          return (
            <button
              key={pkg.id}
              type="button"
              onClick={() => handlePackageClick(pkg.id)}
              disabled={isDisabled}
              className={cn(
                "relative flex items-start p-4 rounded-xl border-2 text-left transition-all group",
                isDisabled
                  ? "border-gray-200 bg-gray-100 cursor-not-allowed opacity-60"
                  : isSelected
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 bg-white hover:border-orange-300"
              )}
            >
              <div className={cn(
                "flex items-center justify-center h-5 w-5 rounded-full border-2 mr-3 mt-0.5 transition-colors",
                isDisabled
                  ? "border-gray-300 bg-gray-200"
                  : isSelected
                  ? "border-orange-500 bg-orange-500"
                  : "border-gray-300 group-hover:border-orange-400"
              )}>
                {isSelected && (
                  <Check className="h-3 w-3 text-white" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={cn(
                    "font-bold text-base transition-colors",
                    isDisabled
                      ? "text-gray-400"
                      : isSelected 
                      ? "text-orange-600" 
                      : "text-gray-800"
                  )}>
                    {pkg.name}
                    {pkg.id === "contest" && categoryCount > 0 && (
                      <span className="ml-2 text-xs font-normal text-orange-500">
                        ({categoryCount} kategori)
                      </span>
                    )}
                  </h3>
                  <span className={cn(
                    "font-bold text-base",
                    isDisabled
                      ? "text-gray-400"
                      : isSelected 
                      ? "text-orange-600" 
                      : "text-gray-800"
                  )}>
                    {pkg.id === "contest" ? formatPrice(getContestPrice()) : formatPrice(pkg.price)}
                  </span>
                </div>
                {pkg.id === "meetup" && isMeetUpDisabled() && (
                  <p className="text-xs text-gray-500 mt-1">
                    Pilih Contest terlebih dahulu untuk memilih Meet Up
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Total Payment Info */}
      {selectedPackages.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          {/* Breakdown */}
          {categoryCount > 0 && selectedPackages.includes("contest") && (
            <div className="mb-3 pb-3 border-b border-orange-200">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">
                  Contest ({categoryCount} kategori × Rp 350.000)
                </span>
                <span className="font-semibold text-gray-700">
                  {formatPrice(getContestPrice())}
                </span>
              </div>
              {selectedPackages.includes("meetup") && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Meet Up</span>
                  <span className="font-semibold text-gray-700">
                    {formatPrice(150000)}
                  </span>
                </div>
              )}
            </div>
          )}
          
          {/* Total */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">
              Total Pembayaran:
            </span>
            <span className="text-xl font-bold text-orange-600">
              {formatPrice(calculateTotal())}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
