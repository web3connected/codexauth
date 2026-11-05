<?php

namespace Web3Codex\CodexCore\Services;

use Carbon\Carbon;
use App\Models\UserPlan;

class UsageTrackerService
{
    public function canPerformOperation($user, string $operationType): bool
    {
        $plan = $user->currentPlan();

        if (!$plan->has_limits) {
            return true;
        }

        $usage = $user->usage()
            ->where('operation_type', $operationType)
            ->whereMonth('created_at', Carbon::now()->month)
            ->sum('count');

        return $usage < $plan->getLimitFor($operationType);
    }

    public function recordOperation($user, string $operationType, int $count = 1)
    {
        $user->usage()->create([
            'operation_type' => $operationType,
            'count' => $count,
            'ip_address' => request()->ip()
        ]);
    }

    public function remainingOperations($user, string $operationType): ?int
    {
        $plan = $user->currentPlan();

        if (!$plan->has_limits) {
            return null; // Unlimited
        }

        $used = $user->usage()
            ->where('operation_type', $operationType)
            ->whereMonth('created_at', Carbon::now()->month)
            ->sum('count');

        return max(0, $plan->getLimitFor($operationType) - $used);
    }
}
