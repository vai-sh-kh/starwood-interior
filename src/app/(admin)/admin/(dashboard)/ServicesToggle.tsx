"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { toast } from "sonner";
import { updateSettingClient } from "@/lib/api/client/settings";

interface ServicesToggleProps {
  initialValue: boolean;
}

export default function ServicesToggle({ initialValue }: ServicesToggleProps) {
  const [enabled, setEnabled] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingValue, setPendingValue] = useState<boolean | null>(null);

  const handleToggle = async (checked: boolean) => {
    setIsLoading(true);
    try {
      const { error } = await updateSettingClient("services_enabled", checked);

      if (error) {
        throw new Error(error.message || "Failed to update setting");
      }

      setEnabled(checked);
      toast.success(
        checked ? "Services section enabled" : "Services section disabled"
      );
      // Close dialog after successful update
      setShowConfirmDialog(false);
      setPendingValue(null);
    } catch (error) {
      console.error("Error updating setting:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update setting";
      toast.error(errorMessage);
      // Revert the toggle on error
      setEnabled(!checked);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setPendingValue(checked);
    setShowConfirmDialog(true);
  };

  const handleConfirm = () => {
    if (pendingValue !== null && !isLoading) {
      handleToggle(pendingValue);
    }
  };

  const handleCancel = () => {
    if (!isLoading) {
      setShowConfirmDialog(false);
      setPendingValue(null);
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open && !isLoading) {
      // Dialog is being closed (via overlay click, ESC key, etc.)
      setPendingValue(null);
    }
    if (!isLoading) {
      setShowConfirmDialog(open);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white">
      <div className="flex items-center gap-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            {enabled ? "Enable Services" : "Disable Services"}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {enabled
              ? "Services section is visible in navigation and accessible"
              : "Services section is hidden from navigation and disabled"}
          </p>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-help">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">
              When enabled, the Services section appears in the header
              navigation and users can access /services pages. When disabled,
              the Services link is hidden and all service routes are blocked.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
      <Switch
        checked={enabled}
        onCheckedChange={handleSwitchChange}
        disabled={isLoading}
        aria-label={enabled ? "Disable services" : "Enable services"}
      />
      <AlertDialog
        open={showConfirmDialog}
        onOpenChange={handleDialogOpenChange}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingValue ? "Enable Services?" : "Disable Services?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingValue
                ? "This will make the Services section visible in navigation and accessible to users. Are you sure you want to continue?"
                : "This will hide the Services section from navigation and block all service routes. Are you sure you want to continue?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel} disabled={isLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={isLoading}
              className={buttonVariants({ variant: "destructive" })}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {pendingValue ? "Enabling..." : "Disabling..."}
                </>
              ) : pendingValue ? (
                "Enable"
              ) : (
                "Disable"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
