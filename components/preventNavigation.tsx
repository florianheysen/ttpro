"use client";

import { useRouter } from "next/navigation";
import { memo, useEffect, useRef, useState } from "react";
import { LeavingDialog } from "./leavingDialog";

type PreventNavigationProps = {
    isDirty: boolean;
    backHref: string;
    resetData: () => void;
};

export const PreventNavigation = ({ isDirty, backHref, resetData }: PreventNavigationProps) => {
    const [leavingPage, setLeavingPage] = useState(false);
    const router = useRouter();

    /**
     * Function that will be called when the user selects `yes` in the confirmation modal,
     * redirected to the selected page.
     */
    const confirmationFn = useRef<() => void>(() => {});

    // Ensure popstate event triggers when back button is clicked.
    if (typeof window !== "undefined") {
        window.history.pushState(null, document.title, window.location.href);
    }

    useEffect(() => {
        /**
         * Used to prevent navigation when user clicks on navigation `<Link />` or `<a />`.
         * @param event The triggered event.
         */
        const handleClick = (event: MouseEvent) => {
            // Find the closest <a> element
            const target = (event.target as HTMLElement).closest("a");

            if (target && isDirty) {
                event.preventDefault();

                confirmationFn.current = () => {
                    router.push(target.href);
                };

                setLeavingPage(true);
            }
        };

        /**
         * Used to prevent navigation when user clicks the browser's back button.
         */
        const handlePopState = () => {
            if (isDirty) {
                window.history.pushState(null, document.title, window.location.href);

                confirmationFn.current = () => {
                    router.push(backHref);
                };

                setLeavingPage(true);
            } else {
                window.history.back();
            }
        };

        /**
         * Used to prevent navigation when reloading the page or navigating to another origin.
         * @param event The triggered event.
         */
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (isDirty) {
                event.preventDefault();
                event.returnValue = true;
            }
        };

        // Attach event listeners
        document.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", handleClick);
        });
        window.addEventListener("popstate", handlePopState);
        window.addEventListener("beforeunload", handleBeforeUnload);

        // Cleanup event listeners on unmount
        return () => {
            document.querySelectorAll("a").forEach((link) => {
                link.removeEventListener("click", handleClick);
            });
            window.removeEventListener("popstate", handlePopState);
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [isDirty, router, backHref]);

    return (
        <>
            <LeavingDialog
                isOpen={leavingPage}
                noCallback={() => {
                    setLeavingPage(false);
                    confirmationFn.current = () => {};
                }}
                yesCallback={() => {
                    confirmationFn.current();
                    setLeavingPage(false);

                    confirmationFn.current = () => {};
                    resetData();
                }}
            />
        </>
    );
};
