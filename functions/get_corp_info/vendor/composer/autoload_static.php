<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInitefab4893de26c6e20375062e54b93e0c
{
    public static $files = array (
        '7b11c4dc42b3b3023073cb14e519683c' => __DIR__ . '/..' . '/ralouphie/getallheaders/src/getallheaders.php',
        'a0edc8309cc5e1d60e3047b5df6b7052' => __DIR__ . '/..' . '/guzzlehttp/psr7/src/functions_include.php',
        'c964ee0ededf28c96ebd9db5099ef910' => __DIR__ . '/..' . '/guzzlehttp/promises/src/functions_include.php',
        '25072dd6e2470089de65ae7bf11d3109' => __DIR__ . '/..' . '/symfony/polyfill-php72/bootstrap.php',
        'e69f7f6ee287b969198c3c9d6777bd38' => __DIR__ . '/..' . '/symfony/polyfill-intl-normalizer/bootstrap.php',
        'f598d06aa772fa33d905e87be6398fb1' => __DIR__ . '/..' . '/symfony/polyfill-intl-idn/bootstrap.php',
        '37a3dc5111fe8f707ab4c132ef1dbc62' => __DIR__ . '/..' . '/guzzlehttp/guzzle/src/functions_include.php',
    );

    public static $prefixLengthsPsr4 = array (
        'W' => 
        array (
            'WoohooLabs\\Yang\\' => 16,
        ),
        'T' => 
        array (
            'TencentCloud\\' => 13,
        ),
        'S' => 
        array (
            'Symfony\\Polyfill\\Php72\\' => 23,
            'Symfony\\Polyfill\\Intl\\Normalizer\\' => 33,
            'Symfony\\Polyfill\\Intl\\Idn\\' => 26,
        ),
        'P' => 
        array (
            'Psr\\Http\\Message\\' => 17,
        ),
        'L' => 
        array (
            'Lexiangla\\Openapi\\' => 18,
        ),
        'H' => 
        array (
            'Http\\Promise\\' => 13,
            'Http\\Client\\' => 12,
            'Http\\Adapter\\Guzzle6\\' => 21,
        ),
        'G' => 
        array (
            'GuzzleHttp\\Psr7\\' => 16,
            'GuzzleHttp\\Promise\\' => 19,
            'GuzzleHttp\\Command\\Guzzle\\' => 26,
            'GuzzleHttp\\Command\\' => 19,
            'GuzzleHttp\\' => 11,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'WoohooLabs\\Yang\\' => 
        array (
            0 => __DIR__ . '/..' . '/woohoolabs/yang/src',
        ),
        'TencentCloud\\' => 
        array (
            0 => __DIR__ . '/..' . '/tencentcloud/tencentcloud-sdk-php/src/TencentCloud',
        ),
        'Symfony\\Polyfill\\Php72\\' => 
        array (
            0 => __DIR__ . '/..' . '/symfony/polyfill-php72',
        ),
        'Symfony\\Polyfill\\Intl\\Normalizer\\' => 
        array (
            0 => __DIR__ . '/..' . '/symfony/polyfill-intl-normalizer',
        ),
        'Symfony\\Polyfill\\Intl\\Idn\\' => 
        array (
            0 => __DIR__ . '/..' . '/symfony/polyfill-intl-idn',
        ),
        'Psr\\Http\\Message\\' => 
        array (
            0 => __DIR__ . '/..' . '/psr/http-message/src',
        ),
        'Lexiangla\\Openapi\\' => 
        array (
            0 => __DIR__ . '/..' . '/lexiangla/openapi/src',
        ),
        'Http\\Promise\\' => 
        array (
            0 => __DIR__ . '/..' . '/php-http/promise/src',
        ),
        'Http\\Client\\' => 
        array (
            0 => __DIR__ . '/..' . '/php-http/httplug/src',
        ),
        'Http\\Adapter\\Guzzle6\\' => 
        array (
            0 => __DIR__ . '/..' . '/php-http/guzzle6-adapter/src',
        ),
        'GuzzleHttp\\Psr7\\' => 
        array (
            0 => __DIR__ . '/..' . '/guzzlehttp/psr7/src',
        ),
        'GuzzleHttp\\Promise\\' => 
        array (
            0 => __DIR__ . '/..' . '/guzzlehttp/promises/src',
        ),
        'GuzzleHttp\\Command\\Guzzle\\' => 
        array (
            0 => __DIR__ . '/..' . '/guzzlehttp/guzzle-services/src',
        ),
        'GuzzleHttp\\Command\\' => 
        array (
            0 => __DIR__ . '/..' . '/guzzlehttp/command/src',
        ),
        'GuzzleHttp\\' => 
        array (
            0 => __DIR__ . '/..' . '/guzzlehttp/guzzle/src',
        ),
    );

    public static $prefixesPsr0 = array (
        'Q' => 
        array (
            'Qcloud\\Cos\\' => 
            array (
                0 => __DIR__ . '/..' . '/qcloud/cos-sdk-v5/src',
            ),
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
        'Normalizer' => __DIR__ . '/..' . '/symfony/polyfill-intl-normalizer/Resources/stubs/Normalizer.php',
        'QcloudApi' => __DIR__ . '/..' . '/tencentcloud/tencentcloud-sdk-php/src/QcloudApi/QcloudApi.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInitefab4893de26c6e20375062e54b93e0c::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInitefab4893de26c6e20375062e54b93e0c::$prefixDirsPsr4;
            $loader->prefixesPsr0 = ComposerStaticInitefab4893de26c6e20375062e54b93e0c::$prefixesPsr0;
            $loader->classMap = ComposerStaticInitefab4893de26c6e20375062e54b93e0c::$classMap;

        }, null, ClassLoader::class);
    }
}
