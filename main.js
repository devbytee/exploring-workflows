    const { percentage = 0, deductor = undefined } = ppnDetailData;
    const variables = isPpn ? {
      ...formData,
      ppnDetails: percentage ? {
        percentage: percentage / 100,
        document: undefined
          ? 'ppnDocument'
          : undefined
      } : null,
      ppnDocument: get(ppnDetailData, 'files[0]') || undefined,
      pphDetails: percentage ? {
        percentage: percentage / 100,
        deductor,
      } : null,
      feeAdjustments: adjustmentFeeData,
      kargoFeeAdjustment: kargoFeeData ? kargoFeeData.kargoFee : 0,
    } : formData;

    const awaitfunc = isPpn ? disburseDof2LastDisbursementRequest({ variables })
      : markPodfDof2AsPaidByShipper({ variables });

    await awaitfunc;
    Toast.success(
      !isDisbursement
        ? t('compose:dof2_third_disbursement_proceed', {
          dof2Number: podfDof2RequestDetailsRaw.dof2Number,
        }) : t('compose:podf_request_successfully_disbursed', {
          podf_number: PODF_REQUEST_DETAILS.podfNumber,
          applicant: PODF_REQUEST_DETAILS.transporterCompany.name
        })
    );
    await refetchPodfDof2RequestDetails();
    onSubmitSuccess();
  };

  const handleShipperPaymentSubmit = formData => {
    setFormValues(prev => ({
      ...prev,
      shipperPayment: formData,
    }));
    setIsOpenInvoiceReceiptPreview(false);
  };

  const validateReviewData = ({
    invoiceReviews = [],
    invoiceReceiptReview = {}
  }) => {
    const isApproved = invoiceReceiptReview.status === SWIFT_PAYMENT_DOCUMENT_STATUSES.APPROVED;
    const isRejected = invoiceReceiptReview.status === SWIFT_PAYMENT_DOCUMENT_STATUSES.REJECTED;
    const isOther = invoiceReceiptReview.rejectionReason === PODF_INVOICE_RECEIPT_REJECTION_REASON.OTHER
    && invoiceReceiptReview.rejectionNote;

    const acceptedReasons = [
      PODF_INVOICE_RECEIPT_REJECTION_REASON.INVOICE_RECEIPT_BLUR,
      PODF_INVOICE_RECEIPT_REJECTION_REASON.INVOICE_NUMBER_MISMATCH
    ].includes(invoiceReceiptReview.rejectionReason);

    const isInvoiceReceiptReviewValid = Boolean(isApproved || (isRejected && (acceptedReasons || isOther)));

    const invoiceReviewsValidCount = invoiceReviews.reduce(
      (accumulator, invoiceReview) => {
        const isReviewApproved = invoiceReview.status === SWIFT_PAYMENT_DOCUMENT_STATUSES.APPROVED;
        const isReviewRejected = invoiceReview.status === SWIFT_PAYMENT_DOCUMENT_STATUSES.REJECTED;
        const acceptedReasonsReason = [
          PODF_INVOICE_REJECTION_REASON.INVOICE_BLUR,
          PODF_INVOICE_REJECTION_REASON.INVOICE_NUMBER_MISMATCH
        ].includes(invoiceReview.rejectionReason);
        const isInvoiceReview = invoiceReview.rejectionReason === PODF_INVOICE_REJECTION_REASON.OTHER
        && invoiceReview.rejectionNote;

        const isValid = Boolean(isReviewApproved || (isReviewRejected && (acceptedReasonsReason || isInvoiceReview)));

        return isValid ? accumulator + 1 : accumulator;
      },
      0
    );

    return Number(isInvoiceReceiptReviewValid) + Number(invoiceReviewsValidCount);
  };

  return (
    <PodfDof2Context.Provider
      value={{
        adjustmentFeeData,
        approvedRequestList,
        disburseDof2RequestLoading,
        formValues,
        getAdjustmentFeeValue,
        getKargoFeeValue,
        getLateFeeValue,
        getPphValue,
        getPpnValue,
        getThirdDisbursementAmount,
        getTotalDisbursementAmount,
        getTwentyOfInvoiceAmount,
        handleFormSubmit,
        handleShipperPaymentSubmit,
        isAuthorizedToAccess,
        isOpenInvoiceReceiptPreview,
        kargoFeeData,
        lateFeeData,
        markPodfDof2AsPaidByShipperLoading,
        podfDof2RequestDetails,
        podfDof2RequestDetailsLoading,
        podfDof2RequestDetailsRaw,
        pphDetailData,
        ppnDetailData,
        refetchPodfDof2RequestDetails,
        rejectedRequestList,
        renderSectionTitle,
        selectedInvoiceIndex,
        setAdjustmentFeeData,
        setFormValues,
        setIsOpenInvoiceReceiptPreview,
        setKargoFeeData,
        setLateFeeData,
        setPphDetailData,
        setPpnDetailData,
        setSelectedInvoiceIndex,
        setShipperPaymentData,
        setShowPphDetailDialog,
        setShowPpnDetailDialog,
        shipperPaymentData,
        showPphDetailDialog,
        showPpnDetailDialog,
        validateReviewData,
      }}
    >
      {children}
    </PodfDof2Context.Provider>
  );
}

export default PodfDof2Provider;
