@if($post->exists)
    <form action="{{route('update_post_path', ['id' => $post->id])}}" method="put" id="form-post-edit">
@else
    <form action="{{route('store_post_path')}}" method="post" id="form-post-create">
@endif

    {{ csrf_field() }}
    <div class="form-group">
        <label for="title">{{ trans('form.title') }}</label>
        <input type="text" name="title" class="form-control" value="{{ $post->title }}">
        <div class="invalid-feedback"></div>
    </div>

    <div class="form-group">
        <label for="description">{{ trans('form.description') }}</label>
        <textarea name="description" rows="5" class="form-control">{{ $post->description }}</textarea>
        <div class="invalid-feedback"></div>
    </div>

    <div class="form-group">
        <label for="slug">Slug</label>
        <input type="text" name="slug" class="form-control" value="{{ $post->slug }}">
        <div class="invalid-feedback"></div>
    </div>
        
    <div class="form-group">
        <button type="submit" class="btn btn-primary has-spinner" data-load-text="{{ trans('btn.saving') }}">{{ trans('btn.save') }}</button>
    </div>

</form>