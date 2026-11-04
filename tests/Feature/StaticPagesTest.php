<?php

test('static pages render', function (string $url, string $component) {
    $this->get($url)
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component($component));
})->with([
    ['/about', 'About'],
    ['/delivery', 'Delivery'],
    ['/contacts', 'Contacts'],
]);
