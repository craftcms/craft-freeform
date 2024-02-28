<?php

namespace Solspace\Freeform\Library\Processors;

use Solspace\Freeform\Attributes\Property\ValueTransformer;
use Solspace\Freeform\Library\Attributes\Attributes;
use Solspace\Freeform\Library\Helpers\AttributeHelper;
use Solspace\Freeform\Library\Helpers\ReflectionHelper;
use yii\di\Container;

abstract class AbstractOptionProcessor
{
    protected function processAttributeValue(
        Attributes $attributes,
        \ReflectionClass $reflection,
        string $key,
        mixed $value
    ): void {
        try {
            $property = $reflection->getProperty($key);
        } catch (\ReflectionException $e) {
            return;
        }

        if (!$property) {
            return;
        }

        $isAttribute = ReflectionHelper::isInstanceOf(
            $property->getType()?->getName(),
            Attributes::class,
        );

        if (!$isAttribute) {
            return;
        }

        $attributes->merge($value);
    }

    protected function processPropertyValue(
        \ReflectionClass $reflection,
        object $object,
        string $key,
        mixed $value
    ): void {
        try {
            $property = $reflection->getProperty($key);
        } catch (\ReflectionException) {
            return;
        }

        if (!$property) {
            return;
        }

        $isAttribute = ReflectionHelper::isInstanceOf(
            $property->getType()?->getName(),
            Attributes::class,
        );

        if ($isAttribute) {
            return;
        }

        $transformer = AttributeHelper::findAttribute($property, ValueTransformer::class);
        if ($transformer instanceof ValueTransformer) {
            $instance = $this->getContainer()->get($transformer->className);
            if ($instance) {
                $value = $instance->transform($value);
            }
        }

        if ('value' === $key) {
            try {
                $defaultValueProperty = $reflection->getProperty('defaultValue');
                if ($defaultValueProperty) {
                    $defaultValueProperty->setAccessible(true);
                    $defaultValueProperty->setValue($object, $value);
                    $defaultValueProperty->setAccessible(false);
                }
            } catch (\ReflectionException) {
            }
        }

        $property->setAccessible(true);
        $property->setValue($object, $value);
        $property->setAccessible(false);
    }

    protected function getContainer(): Container
    {
        return \Craft::$container;
    }
}
