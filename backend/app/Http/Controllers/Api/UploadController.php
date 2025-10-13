<?php 
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    // app/Http/Controllers/Api/UploadController.php
public function uploadEkskulImage(Request $request)
{
    $request->validate([
        'file' => 'required|file|mimes:webp|max:2048',
    ]);

    $path = $request->file('file')->store('ekskul', 'public');
    $url = asset('storage/' . $path);

    return response()->json(['success' => true, 'url' => $url]);
}

}
