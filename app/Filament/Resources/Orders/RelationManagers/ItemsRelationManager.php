<?php

namespace App\Filament\Resources\Orders\RelationManagers;

use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ItemsRelationManager extends RelationManager
{
    protected static string $relationship = 'items';

    protected static ?string $title = 'Состав заказа';

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')->label('Товар')->searchable(),
                TextColumn::make('bazon_id')->label('ID Bazon'),
                TextColumn::make('price')->label('Цена')->money('RUB'),
                TextColumn::make('quantity')->label('Кол-во'),
                TextColumn::make('subtotal')->label('Сумма')->money('RUB'),
            ])
            ->paginated(false);
    }
}
