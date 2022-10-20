class Order {
  id;
  event_id;
  event_date;
  ticket_adult_price;
  ticket_adult_quantity;
  ticket_kid_price;
  ticket_kid_quantity;
  barcode;
  user_id;
  equal_price;
  created;

  constructor(orderParams) {
    this.id = orderParams.id;
    this.event_id = orderParams.event_id;
    this.event_date = orderParams.event_date;
    this.ticket_adult_price = orderParams.ticket_adult_price;
    this.ticket_adult_quantity = orderParams.ticket_adult_quantity;
    this.ticket_kid_price = orderParams.ticket_kid_price;
    this.ticket_kid_quantity = orderParams.ticket_kid_quantity;
    this.barcode = orderParams.barcode;
    this.user_id = orderParams.user_id;
    this.equal_price = orderParams.equal_price;
    this.created = new Date();
  }
}

class Ticket {
  id;
  order_id;
  user_id;
  barcode;
}