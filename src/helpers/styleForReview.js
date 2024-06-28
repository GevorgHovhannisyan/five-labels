export default `
.popup_block {
    position: fixed;
    left: 0;
    width: 100%;
    height: 100%;
    top: 100%;
    overflow: hidden;
    z-index: 1000;
    -o-transition: top 0.5s;
    -ms-transition: top 0.5s;
    -moz-transition: top 0.5s;
    -webkit-transition: top 0.5s;
    transition: top 0.5s;
  }
  .popup_block.showed {
    top: 0;
    overflow-y: auto;
  }

  .popup_inner {
    display: flex;
    width: 100%;
    min-height: 100%;
    justify-content: center;
    align-items: center;
    padding: 16px;
  }

  .invoice_popup .popup_container {
    background: #ffffff;
    width: 100%;
    max-width: 632px;
    padding: 60px 30px 40px;
    position: relative;
    border-radius: 4px;
  }
  .invoice_popup .section_subtitle {
    text-align: center;
      font-size: 240%;
    margin-bottom: 30px;
  }
  .invoice_popup .product_info {
    display: flex;
    margin: 0 -15px;
  }
  .invoice_popup .image_block {
    flex: 0 0 50%;
    max-width: 50%;
    padding: 0 15px;
  }
  .invoice_popup .image_inner {
    padding: 20px;
    border-radius: 3px;
    background: #f3f3f3;
  }
  .invoice_popup .image_inner img {
    display: block;
    margin: 0 auto;
    width: 100%;
    max-width: 200px;
    height: auto;
  }
  .invoice_popup .info_block {
    flex: 0 0 50%;
    max-width: 50%;
    padding: 0 15px;
  }
  .invoice_popup .order_number {
    font-family: "sourcesans-pro-bold";
    letter-spacing: 0.02em;
    padding-bottom: 10px;
  }
  .invoice_popup .details_list li {
    display: flex;
    padding-top: 6px;
  }
  .invoice_popup .details_list .detail_type {
    margin-right: 10px;
    font-family: "sourcesans-pro-semibold";
  }
  .invoice_popup .details_list .detail_info {
    color: #5A5A5A;
  }
  .invoice_popup .summary_block {
    margin-top: 24px;
    border-top: 1px solid #9d9d9d;
    padding-top: 20px;
    display: flex;
    justify-content: center;
    padding-bottom: 50px;
  }
  .invoice_popup .price_label {
    font-family: "sourcesans-pro-semibold";
    padding-bottom: 8px;
  }
  .invoice_popup .price_includes {
    padding-right: 40px;
  }
  .invoice_popup .price_includes table {
    border-spacing: 0;
  }
  .invoice_popup .price_includes table td {
    padding: 0;
    vertical-align: top;
  }
  .invoice_popup .price_includes table td:first-child {
    color: #9d9d9d;
    padding-right: 12px;
    padding-top: 3px;
  }
  .invoice_popup .price_includes table td:last-child {
    font-family: "sourcesans-pro-semibold";
    color: #5A5A5A;
    white-space: nowrap;
  }
  .invoice_popup .price_includes table tr:not(:last-child) td {
    padding-bottom: 4px;
  }
  .invoice_popup .price_total {
    display: flex;
    flex-direction: column;
  }
  .invoice_popup .price_total .price_label {
    padding-left: 14px;
  }
  .invoice_popup .price_total .price_size {
    flex: 1;
    display: flex;
    align-items: center;
    white-space: nowrap;
    font-family: "sourcesans-pro-semibold";
    border-left: 1px solid #9d9d9d;
    padding-left: 13px;
  }
  .invoice_popup .popup_actions {
    justify-content: space-around;
  }
  .invoice_popup .popup_actions * {
    font-family: "sourcesans-pro-semibold";
    color: #0098DA;
    height: 48px;
    margin: 0 15px;
    flex: 1;
    max-width: 230px;
  }
  .invoice_popup .popup_actions *:active {
    color: #0098DA;
  }
  .invoice_popup .popup_actions *:active *, .invoice_popup .popup_actions *:active:after {
    color: inherit;
  }
  .invoice_popup .popup_actions .icon_pdf:before {
    display: block;
    font-size: 2.4rem;
    margin-right: 18px;
  }
  .invoice_popup .popup_actions .icon_print:before {
    display: block;
    font-size: 2.1rem;
    margin-right: 16px;
  }

`
