import AppHeader from "@saleor/components/AppHeader";
import CardSpacer from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import ControlledSwitch from "@saleor/components/ControlledSwitch";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { ChangeEvent, FormChange } from "@saleor/hooks/useForm";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { sectionNames } from "@saleor/intl";
import { maybe } from "@saleor/misc";
import { ListActions, ReorderEvent, UserError } from "@saleor/types";
import { AttributeTypeEnum, WeightUnitsEnum } from "@saleor/types/globalTypes";
import React from "react";
import { useIntl } from "react-intl";

import {
  ProductTypeDetails_productType,
  ProductTypeDetails_taxTypes
} from "../../types/ProductTypeDetails";
import ProductTypeAttributes from "../ProductTypeAttributes/ProductTypeAttributes";
import ProductTypeDetails from "../ProductTypeDetails/ProductTypeDetails";
import ProductTypeShipping from "../ProductTypeShipping/ProductTypeShipping";
import ProductTypeTaxes from "../ProductTypeTaxes/ProductTypeTaxes";

interface ChoiceType {
  label: string;
  value: string;
}

export interface ProductTypeForm {
  name: string;
  hasVariants: boolean;
  isCustomizable: boolean;
  isShippingRequired: boolean;
  isDigital: boolean;
  taxType: string;
  productAttributes: ChoiceType[];
  variantAttributes: ChoiceType[];
  customizableAttributes: ChoiceType[];
  weight: number;
}

export interface ProductTypeDetailsPageProps {
  errors: UserError[];
  productType: ProductTypeDetails_productType;
  defaultWeightUnit: WeightUnitsEnum;
  disabled: boolean;
  pageTitle: string;
  productAttributeList: ListActions;
  saveButtonBarState: ConfirmButtonTransitionState;
  taxTypes: ProductTypeDetails_taxTypes[];
  variantAttributeList: ListActions;
  customizableAttributeList: ListActions;
  onAttributeAdd: (type: AttributeTypeEnum) => void;
  onAttributeClick: (id: string) => void;
  onAttributeReorder: (event: ReorderEvent, type: AttributeTypeEnum) => void;
  onAttributeUnassign: (id: string) => void;
  onBack: () => void;
  onDelete: () => void;
  onHasVariantsToggle: (hasVariants: boolean) => void;
  onIsCustomizableToggle: (isCustomizable: boolean) => void;
  onSubmit: (data: ProductTypeForm) => void;
}

function handleTaxTypeChange(
  event: ChangeEvent,
  taxTypes: ProductTypeDetails_taxTypes[],
  formChange: FormChange,
  displayChange: (name: string) => void
) {
  formChange(event);
  displayChange(
    taxTypes.find(taxType => taxType.taxCode === event.target.value).description
  );
}

const ProductTypeDetailsPage: React.FC<ProductTypeDetailsPageProps> = ({
  defaultWeightUnit,
  disabled,
  errors,
  pageTitle,
  productType,
  productAttributeList,
  saveButtonBarState,
  taxTypes,
  variantAttributeList,
  customizableAttributeList,
  onAttributeAdd,
  onAttributeUnassign,
  onAttributeReorder,
  onAttributeClick,
  onBack,
  onDelete,
  onHasVariantsToggle,
  onIsCustomizableToggle,
  onSubmit
}) => {
  const intl = useIntl();
  const [taxTypeDisplayName, setTaxTypeDisplayName] = useStateFromProps(
    maybe(() => productType.taxType.description, "")
  );
  const formInitialData: ProductTypeForm = {
    customizableAttributes:
      maybe(() => productType.customizableAttributes) !== undefined
        ? productType.customizableAttributes.map(attribute => ({
            label: attribute.name,
            value: attribute.id
          }))
        : [],
    hasVariants:
      maybe(() => productType.hasVariants) !== undefined
        ? productType.hasVariants
        : false,
    isCustomizable:
      maybe(() => productType.isCustomizable) !== undefined
        ? productType.isCustomizable
        : false,
    isDigital:
      maybe(() => productType.isDigital) !== undefined
        ? productType.isDigital
        : false,
    isShippingRequired:
      maybe(() => productType.isShippingRequired) !== undefined
        ? productType.isShippingRequired
        : false,
    name: maybe(() => productType.name) !== undefined ? productType.name : "",
    productAttributes:
      maybe(() => productType.productAttributes) !== undefined
        ? productType.productAttributes.map(attribute => ({
            label: attribute.name,
            value: attribute.id
          }))
        : [],
    taxType: maybe(() => productType.taxType.taxCode, ""),
    variantAttributes:
      maybe(() => productType.variantAttributes) !== undefined
        ? productType.variantAttributes.map(attribute => ({
            label: attribute.name,
            value: attribute.id
          }))
        : [],
    weight: maybe(() => productType.weight.value)
  };
  return (
    <Form initial={formInitialData} onSubmit={onSubmit} confirmLeave>
      {({ change, data, hasChanged, submit }) => (
        <Container>
          <AppHeader onBack={onBack}>
            {intl.formatMessage(sectionNames.productTypes)}
          </AppHeader>
          <PageHeader title={pageTitle} />
          <Grid>
            <div>
              <ProductTypeDetails
                data={data}
                disabled={disabled}
                errors={errors}
                onChange={change}
              />
              <CardSpacer />
              <ProductTypeTaxes
                disabled={disabled}
                data={data}
                taxTypes={taxTypes}
                taxTypeDisplayName={taxTypeDisplayName}
                onChange={event =>
                  handleTaxTypeChange(
                    event,
                    taxTypes,
                    change,
                    setTaxTypeDisplayName
                  )
                }
              />
              <CardSpacer />
              <ProductTypeAttributes
                attributes={maybe(() => productType.productAttributes)}
                disabled={disabled}
                type={AttributeTypeEnum.PRODUCT}
                onAttributeAssign={onAttributeAdd}
                onAttributeClick={onAttributeClick}
                onAttributeReorder={(event: ReorderEvent) =>
                  onAttributeReorder(event, AttributeTypeEnum.PRODUCT)
                }
                onAttributeUnassign={onAttributeUnassign}
                {...productAttributeList}
              />
              <CardSpacer />
              <ControlledSwitch
                checked={data.hasVariants}
                disabled={disabled}
                label={intl.formatMessage({
                  defaultMessage: "Product type uses Variant Attributes",
                  description: "switch button"
                })}
                name="hasVariants"
                onChange={event => onHasVariantsToggle(event.target.value)}
              />
              {data.hasVariants && (
                <>
                  <CardSpacer />
                  <ProductTypeAttributes
                    attributes={maybe(() => productType.variantAttributes)}
                    disabled={disabled}
                    type={AttributeTypeEnum.VARIANT}
                    onAttributeAssign={onAttributeAdd}
                    onAttributeClick={onAttributeClick}
                    onAttributeReorder={(event: ReorderEvent) =>
                      onAttributeReorder(event, AttributeTypeEnum.VARIANT)
                    }
                    onAttributeUnassign={onAttributeUnassign}
                    {...variantAttributeList}
                  />
                </>
              )}
              <br />
              <ControlledSwitch
                checked={data.isCustomizable}
                disabled={disabled}
                label={intl.formatMessage({
                  defaultMessage: "Product type uses Customizable Attributes",
                  description: "switch button"
                })}
                name="isCustomizable"
                onChange={event => onIsCustomizableToggle(event.target.value)}
              />
              {data.isCustomizable && (
                <>
                  <CardSpacer />
                  <ProductTypeAttributes
                    attributes={maybe(() => productType.customizableAttributes)}
                    disabled={disabled}
                    type={AttributeTypeEnum.CUSTOM}
                    onAttributeAssign={onAttributeAdd}
                    onAttributeClick={onAttributeClick}
                    onAttributeReorder={(event: ReorderEvent) =>
                      onAttributeReorder(event, AttributeTypeEnum.CUSTOM)
                    }
                    onAttributeUnassign={onAttributeUnassign}
                    {...customizableAttributeList}
                  />
                </>
              )}
            </div>
            <div>
              <ProductTypeShipping
                disabled={disabled}
                data={data}
                defaultWeightUnit={defaultWeightUnit}
                onChange={change}
              />
            </div>
          </Grid>
          <SaveButtonBar
            onCancel={onBack}
            onDelete={onDelete}
            onSave={submit}
            disabled={disabled || !hasChanged}
            state={saveButtonBarState}
          />
        </Container>
      )}
    </Form>
  );
};
ProductTypeDetailsPage.displayName = "ProductTypeDetailsPage";
export default ProductTypeDetailsPage;
