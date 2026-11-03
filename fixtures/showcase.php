<?php
namespace App\Theme;
use DateTimeImmutable;
/** A small typed service. */
#[Service]
class UserService {
    public const LIMIT = 42;
    public function greet(?string $name): string {
        $active = true;
        return $active && $name !== null ? $name : "Guest";
    }
}
$service = new UserService();
echo $service?->greet(null) ?? "Offline";
