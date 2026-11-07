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
                    Select::make('delivery_company')
                        ->label('Транспортная компания')
                        ->options([
                            'cdek' => 'СДЭК',
                            'energia' => 'Энергия',
                        ]),
                    TextInput::make('delivery_city')->label('Город'),
                    TextInput::make('delivery_point')->label('Пункт выдачи СДЭК'),
                    TextInput::make('delivery_cost')->label('Доставка до ТК, ₽')->numeric(),
                    TextInput::make('customer_lastname')->label('Фамилия'),
                    TextInput::make('customer_middlename')->label('Отчество'),
                ]),
        ]);
    }
}
