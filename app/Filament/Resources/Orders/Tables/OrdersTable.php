<?php

namespace App\Filament\Resources\Orders\Tables;

use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class OrdersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('number')
                    ->label('№')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('customer_name')
                    ->label('Клиент')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('customer_phone')
                    ->label('Телефон')
                    ->searchable(),
                TextColumn::make('status')
                    ->label('Статус')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'new' => 'Новый',
                        'processing' => 'В обработке',
                        'ready' => 'Готов к выдаче',
                        'completed' => 'Выполнен',
                        'cancelled' => 'Отменён',
                        default => $state,
                    })
                    ->color(fn (string $state): string => match ($state) {
                        'new' => 'info',
                        'processing' => 'warning',
                        'ready' => 'success',
                        'completed' => 'success',
                        'cancelled' => 'danger',
                        default => 'gray',
                    })
                    ->sortable(),
                TextColumn::make('total')
                    ->label('Сумма')
                    ->money('RUB')
                    ->sortable(),
                TextColumn::make('delivery_type')
                    ->label('Получение')
                    ->formatStateUsing(fn (string $state): string => $state === 'pickup' ? 'Самовывоз' : 'Доставка ТК'),
                TextColumn::make('created_at')
                    ->label('Создан')
                    ->dateTime('d.m.Y H:i')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('status')
                    ->label('Статус')
                    ->options([
                        'new' => 'Новый',
                        'processing' => 'В обработке',
                        'ready' => 'Готов к выдаче',
                        'completed' => 'Выполнен',
                        'cancelled' => 'Отменён',
                    ]),
                SelectFilter::make('delivery_type')
                    ->label('Получение')
                    ->options([
                        'pickup' => 'Самовывоз',
                        'delivery' => 'Доставка ТК',
                    ]),
            ])
            ->recordActions([
                EditAction::make(),
            ]);
    }
}
