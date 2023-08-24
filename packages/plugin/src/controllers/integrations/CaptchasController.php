<?php
/**
 * Freeform for Craft CMS.
 *
 * @author        Solspace, Inc.
 * @copyright     Copyright (c) 2008-2022, Solspace, Inc.
 *
 * @see           https://docs.solspace.com/craft/freeform
 *
 * @license       https://docs.solspace.com/license-agreement
 */

namespace Solspace\Freeform\controllers\integrations;

use Solspace\Freeform\Freeform;
use Solspace\Freeform\Library\Integrations\IntegrationInterface;
use Solspace\Freeform\Services\Integrations\AbstractIntegrationService;

class CaptchasController extends IntegrationsController
{
    protected function getTitle(): string
    {
        return 'Captchas';
    }

    protected function getTypeShorthand(): string
    {
        return IntegrationInterface::TYPE_CAPTCHAS;
    }

    protected function getDedicatedService(): AbstractIntegrationService
    {
        return Freeform::getInstance()->captchas;
    }
}
