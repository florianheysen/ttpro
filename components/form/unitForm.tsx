import React from "react";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";

function UnitForm({ handleSubmit, formSchema, btnLabel }: { handleSubmit: any; formSchema: any; btnLabel: string }) {
    return (
        <AutoForm onSubmit={(e) => handleSubmit(e)} formSchema={formSchema}>
            <AutoFormSubmit>{btnLabel}</AutoFormSubmit>
        </AutoForm>
    );
}

export default UnitForm;
