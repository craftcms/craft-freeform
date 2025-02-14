<?php

namespace Solspace\Freeform\Library\Integrations;

use JetBrains\PhpStorm\ArrayShape;
use Psr\Http\Message\ResponseInterface;
use Solspace\Freeform\Attributes\Property\Implementations\FieldMapping\FieldMapItem;
use Solspace\Freeform\Attributes\Property\Implementations\FieldMapping\FieldMapping;
use Solspace\Freeform\Events\Integrations\CrmIntegrations\ProcessValueEvent;
use Solspace\Freeform\Form\Form;
use yii\base\Event;

abstract class APIIntegration extends BaseIntegration implements APIIntegrationInterface
{
    /**
     * Returns a combined URL of api root + endpoint.
     */
    protected function getEndpoint(string $endpoint): string
    {
        $root = rtrim($this->getApiRootUrl(), '/');
        $endpoint = ltrim($endpoint, '/');

        return "{$root}/{$endpoint}";
    }

    abstract protected function getProcessableFields(string $category): array;

    #[ArrayShape([
        0 => ResponseInterface::class,
        1 => 'object|array',
    ])]
    protected function getJsonResponse(ResponseInterface $response): array
    {
        return [$response, json_decode($response->getBody()->getContents())];
    }

    protected function processMapping(Form $form, ?FieldMapping $mapping, string $category): array
    {
        if (null === $mapping) {
            return [];
        }

        $fields = $this->getProcessableFields($category);

        $keyValueMap = [];
        foreach ($mapping as $item) {
            $integrationField = $fields[$item->getSource()] ?? null;
            if (!$integrationField) {
                continue;
            }

            if (FieldMapItem::TYPE_RELATION === $item->getType() && empty($item->getValue())) {
                continue;
            }

            $freeformField = $form->get($item->getValue());

            $key = $item->getSource();
            $value = $item->extractValue(
                $form,
                ['integration' => $this, 'category' => $category]
            );

            $event = new ProcessValueEvent(
                $this,
                $form,
                $integrationField,
                $freeformField,
                $value
            );

            Event::trigger(
                APIIntegrationInterface::class,
                APIIntegrationInterface::EVENT_PROCESS_VALUE,
                $event
            );

            $keyValueMap[$key] = $event->getValue();
        }

        return $keyValueMap;
    }
}
