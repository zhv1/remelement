<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NewOrderMail extends Mailable
{
    use Queueable, SerializesModels;

    public Order $order;

    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function build()
    {
        return $this->subject("Новый заказ {$this->order->number} с сайта")
            ->to('info@remelem.ru')
            ->from(config('mail.from.address'), config('mail.from.name'))
            ->view('emails.new-order');
    }
}