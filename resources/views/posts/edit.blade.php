@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="row justify-content-sm-center">
            <div class="col col-sm col-md-8">
                @include('partials.form-post')
            </div>
        </div>
    </div>
@endsection

@push('scripts')
    <script src="{{ asset('js/plugins/button-loader/button-loader.min.js') }}"></script>
    <script src="{{ asset('js/plugins/izi-toast/izi-toast.min.js') }}"></script>
    <script src="{{ asset('js/common/common-functions.js') }}"></script>
    <script src="{{ asset('js/posts/post-edit.js') }}"></script>
@endpush

@push('styles')
    <link href="{{ asset('css/plugins/button-loader/button-loader.css') }}" rel="stylesheet">
    <link href="{{ asset('css/plugins/font-awesome/font-awesome.min.css') }}" rel="stylesheet">
    <link href="{{ asset('css/plugins/izi-toast/izi-toast.min.css') }}" rel="stylesheet">
@endpush