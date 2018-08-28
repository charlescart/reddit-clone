<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PostControllerTest extends TestCase
{
    use DatabaseMigrations;

    public function a_guest_can_see_all_the_posts()
    {
        // Arrange
        $posts = factory(\App\Post::class, 5)->create();

        // Act
        $response = $this->get(route('posts_path'));

        // Assert
        $response->assertStatus(200);
        foreach ($posts as $post) {
            $response->assertSee($post->title);
        }
    }

    public function a_registed_user_can_see_all_the_posts()
    {
        // Arrange
        $user = factory(\App\User::class)->create();
        \Auth::loginUsingId($user->id);

        $posts = factory(\App\Post::class, 2)->create();

        // Act
        $response = $this->get(route('posts_path'));

        // Assert
        $response->assertStatus(200);
        foreach ($posts as $post) {
            $response->assertSee($post->title);
        }
    }

    public function a_user_unautenticated_cannot_edit_the_post()
    {
        // Arrange
        $post = factory(\App\Post::class)->create();

        $response = $this->get(route('edit_post_path', ['post' => $post->id]));

        $response->assertRedirect(route('login'));
    }

    public function a_user_authenticated_but_not_is_author_the_post_editing()
    {
        // Arrange
        $user = factory(\App\User::class)->create(['id' => 3]);
        \Auth::loginUsingId($user->id);
        $post = factory(\App\Post::class)->create();

        $response = $this->get(route('edit_post_path', ['post' => $post->id]));

        $response->assertRedirect(route('posts_path'));
    }

    public function a_user_authenticated_is_author_the_post_editing()
    {
        // Arrange
        $user = factory(\App\User::class)->create();
        \Auth::loginUsingId($user->id);
        $post = factory(\App\Post::class)->create(['user_id' => $user->id]);

        $response = $this->get(route('edit_post_path', ['post' => $post->id]));

        $response->assertStatus(200);
    }

    public function display_author_name()
    {
        $users = factory(\App\User::class, 2)->create();
        $posts = factory(\App\Post::class, 5)->create();

        $response = $this->get(route('posts_path'));

        $response->assertStatus(200);
        foreach ($posts as $key => $post) {
            $response->assertSee(e($post->user->name));
        }
    }

    public function a_guest_cannot_see_form_create()
    {
        $response = $this->get(route('create_post_path'));

        $response->assertRedirect(route('login'));
    }

    public function a_guest_cannot_storage_post()
    {
        $response = $this->post(route('store_post_path'));

        $response->assertRedirect(route('login'));
    }

    public function test_a_user_authenticated_can_create_post()
    {
        $user = factory(\App\User::class)->create();

//        \Auth::loginUsingId($user->id);

        $response = $this->actingAs($user)->post(route('store_post_path'), [
            'title' => 'title',
            'description' => 'description',
            'slug' => 'title',
        ]);

        $response->assertStatus(201);
        $this->assertSame(\App\Post::count(), 1, 'Operacion Exitosa!');
        $post = \App\Post::first();

        $this->assertSame($user->id, $post->user_id, 'El post es de el user correcto!');
    }

    public function test_a_guest_can_not_see_the_create_form()
    {
        $response = $this->get(route('create_post_path'));
        $response->assertRedirect(route('login'));
    }

    public function testSoloElAutorPuedeEditarElPost()
    {
        $user = factory(\App\User::class)->create();
        $post = factory(\App\Post::class)->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->put(route('update_post_path', ['post' => $post->id]), [
            'title' => 'title',
            'description' => 'description',
            'slug' => 'slug'
        ]);

        $response->assertStatus(200);

        $post = \App\Post::find($post->id);

        $this->assertSame($post->title, 'title');
        $this->assertSame($post->description, 'description');
        $this->assertSame($post->slug, 'slug');
    }

    public function testUnUsuarioAutenticadoNoPuedeEditarUnPostQueNoLePertenece()
    {
        $user = factory(\App\User::class)->create(['id' => 1000]);
        $post = factory(\App\Post::class)->create();

        \Auth::loginUsingId($user->id);

        $post_edit = [
            'title' => 'title xxx',
            'description' => 'description xxx',
            'slug' => 'hola-mundo',
        ];

        $response = $this->put(route('update_post_path', ['post' => $post->id]), $post_edit);

        $response->assertStatus(403);

//        $post = \App\Post::where($post->id);

        $this->assertDatabaseMissing('posts', $post_edit);
    }

    public function testUnUsuarioAutenticadoPuedeEliminarSuPropioPost()
    {
        $user = factory(\App\User::class)->create();
        $post = factory(\App\Post::class)->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->delete(route('delete_post_path', ['post' => $post->id]), [
            'id' => $post->id,
        ]);

        $response->assertStatus(200);

//        $post = \App\Post::find($post->id);
//
//        $this->assertNull($post);

        $this->assertSoftDeleted('posts', [
            'id' => $post->id,
            'title' => $post->title,
            'description' => $post->description,
            'slug' => $post->slug,
        ]);
        $this->assertDatabaseHas('posts', [
            'id' => $post->id,
            'title' => $post->title,
            'description' => $post->description,
            'slug' => $post->slug,
        ]);

    }
}
