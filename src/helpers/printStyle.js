export default `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swap');
body {
  margin: 0;
  border: none;
  font-size: 100%;
  padding: 0 20px;
  width: 100%;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  min-height: 100%;
  font-family: 'Poppins', sans-serif;
  font-family: 'Source Sans Pro', sans-serif;
}

.pdf_page {
  max-width: 918px;
  width: 100%;
  margin: 0 auto;
  padding: 0 20px;
}

.inner_pdf {
  max-width: 600px;
  width: 100%;
  padding: 20px 0 10px;
  margin: 0 auto;
  overflow-x: auto;
  height: 100%;

}

.project_logo {
  font-size: 18px;
  line-height: 17px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.asd > span{
  font-size: 20px;
  line-height: 1.33rem;
  color: black;
  font-weight: 600;
}

.mail_block{
  font-size: 12px;
  line-height: 1.33rem;
  color: black;
  font-weight: 400;
}

.asd{
  display: flex;
  flex-direction: column;
}

.project_logo img {
  width: 100%;
  display: block;
  height: auto;
  max-width: 60px;
  margin-right: 10px;
}

.user_infos {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 30px;
}

.user_infos .title_inner {
  margin-top: 0;
}

.user_inner {
  display: flex;
  width: 50%;
  flex-direction: column;
  margin-bottom: 20px;
}

.title_inner {
  font-weight: 600;
  margin-top: 20px;
  font-size: 16px;
  line-height: 1.33rem;
}

.pay.title_inner {
  margin-top: 20px !important;
}

.inner_info {
  margin-top: 2px;
  font-size: 12px;
  line-height: 1.33rem;
}

.invoice_text {
  font-size: 32px;
  line-height: 17px;
  display: flex;
  align-items: center;
  font-weight: 600;
  margin-top: 15px;
}

.text_pdf {
  font-size: 14px;
  line-height: 17px;
  display: flex;
  align-items: center;
  margin-top: 7px;
}

.info_table,
.order {
  width: 100%;
  margin-top: 10px;
  border-collapse: collapse;
}

.info_table th,
.order th {
  border-bottom: 1px solid #d5d5d5;
  text-align: left;
  padding: 8px 0;
  text-transform: uppercase;
  font-size: 16px;
  line-height: 1.33rem;
  font-weight: 600;
}
tbody > tr:last-child > td {
  border-bottom: 1px solid #d5d5d5;
}
.info_table td,
.order td {
  text-align: left;
  padding: 5px 0;
  border-bottom: 1px solid black;
  font-size: 12px;
  line-height: 1.33rem;
}

.price_block {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  margin-left: auto;
  line-height: 1.33rem;
  font-size: 12px;
  // max-width: 164px;
  min-width: 164px;
  width: max-content;
}

.price_inner .title_inner {
  margin-top: 0;
  padding-right: 15px;
}

.price_inner .title_inner,
.price_inner .inner_info {
  font-weight: 600;
  font-size: 22px;
  line-height: 1.33rem;
}

.price_inner {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  width: 100%;
  border-top: 2px solid #f3f3f3;
  padding-top: 5px;
}

.block_pdf .title_inner {
  border-bottom: 2px solid black;
  padding-bottom: 10px;
}

.details,
.track {
  border-bottom: 2px solid black;
  padding-bottom: 10px;
}

.block_pdf .inner_info {
  padding-top: 5px;
}

.info_table {
  text-align: left;
}

a {
  font-size: 14px;
  line-height: 1.44rem;
}

.pft_btn {
  display: flex;
  justify-content: end;
  margin: 0 -10px;
}

.pft_btn button {
  margin: 0 10px;
  border: none;
  padding: 6px 17px;
  font-size: 12px;
  line-height: 1.33rem;
  border-radius: 20px;
}

.close_btn {
  background: #f5f5f5;
  color: #666666;
}

.close_btn:hover {
  cursor: pointer;
  color: #ed3237;
  -webkit-transition: color .3s;
  transition: color .3s;
}

.print_btn_ {
  background: #1a1a9deb;
  color: white;
}

.print_btn_:hover {
  cursor: pointer;
  opacity: 0.7;
  -webkit-transition: opacity .3s;
  transition: opacity .3s;
}

.inner_price {
  font-size: 12px;
  line-height: 1.33rem;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-bottom: 5px;
  padding-top: 5px;
}

.price_title:last-child {
  padding-left: 10px;
}
`
