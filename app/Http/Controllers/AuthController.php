<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|alpha_dash|unique:users,username',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create($validated);
        $token = $user->createToken('api')->plainTextToken;

        return response()->json([
            'message' => 'Registration successful.',
            'token' => $token,
            'user' => $user,
        ], Response::HTTP_CREATED);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid email or password.',
            ], Response::HTTP_UNAUTHORIZED);
        }

        $token = $user->createToken('api')->plainTextToken;

        return response()->json([
            'message' => 'Login successful.',
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function google(Request $request)
    {
        $validated = $request->validate([
            'id_token' => 'required|string',
        ]);

        $googleResponse = Http::get('https://oauth2.googleapis.com/tokeninfo', [
            'id_token' => $validated['id_token'],
        ]);

        if ($googleResponse->failed()) {
            return response()->json([
                'message' => 'Google token verification failed.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $payload = $googleResponse->json();
        $email = $payload['email'] ?? null;
        $googleId = $payload['sub'] ?? null;
        $name = $payload['name'] ?? ($payload['given_name'] ?? 'Google User');
        $expectedClientId = config('services.google.client_id');

        if ($expectedClientId && ($payload['aud'] ?? null) !== $expectedClientId) {
            return response()->json([
                'message' => 'Google token audience is invalid.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        if (!$email || !$googleId) {
            return response()->json([
                'message' => 'Incomplete Google profile data.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $baseUsername = Str::slug(Str::before($email, '@'), '_') ?: 'chef';
        $username = $baseUsername;
        $suffix = 1;

        while (User::where('username', $username)->where('google_id', '!=', $googleId)->exists()) {
            $username = $baseUsername . '_' . $suffix;
            $suffix++;
        }

        $user = User::updateOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'username' => $username,
                'google_id' => $googleId,
                'email_verified_at' => now(),
                'password' => Str::password(24),
            ]
        );

        $token = $user->createToken('api')->plainTextToken;

        return response()->json([
            'message' => 'Google login successful.',
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user()->loadCount('recipes'),
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }
}
