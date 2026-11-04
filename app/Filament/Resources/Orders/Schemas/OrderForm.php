<?php

namespace App\Filament\Resources\Orders\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class OrderForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Статус')
                ->schema([
                    Select::make('status')
                        ->label('Статус заказа')
                        ->options([
                            'new' => 'Новый',
                            'processing' => 'В обработке',
                            'ready' => 'Готов к выдаче',
                            'completed' => 'Выполнен',
                            'cancelled' => 'Отменён',
                        ])
                        ->required(),
                ]),

            Section::make('Клиент')
                ->columns(2)
                ->schema([
                    TextInput::make('customer_name')->label('Имя')->required(),
                    TextInput::make('customer_phone')->label('Телефон')->required(),
                    TextInput::make('customer_email')->label('Email')->email(),
                    Textarea::make('customer_comment')->label('Комментарий')->columnSpanFull(),
                ]),

            Section::make('Доставка')
                ->columns(2)
                ->schema([
                    Select::make('delivery_type')
                        ->label('Способ получения')
                        ->options([
                            'pickup' => 'Самовывоз',
                            'delivery' => 'Доставка ТК',
                        ])
                        ->required(),
                    TextInput::make('delivery_address')->label('Адрес доставки'),
                ]),
        ]);
    }
}
