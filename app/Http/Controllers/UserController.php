<?php

namespace App\Http\Controllers;

use App\Http\Services\UserService;
use Illuminate\Http\Request;

class UserController extends Controller
{
    private UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Get all users
     */
    public function index()
    {
        return $this->userService->getUsers();
    }

    /**
     * Get single user by ID
     */
    public function show($id)
    {
        return $this->userService->getUserById($id);
    }

    /**
     * Create a new user
     */
    public function store(Request $request)
    {
        return $this->userService->createUser($request);
    }

    /**
     * Update user
     */
    public function update(Request $request, $id)
    {
        return $this->userService->updateUser($request, $id);
    }

    /**
     * Delete user
     */
    public function destroy($id)
    {
        return $this->userService->deleteUser($id);
    }
}

