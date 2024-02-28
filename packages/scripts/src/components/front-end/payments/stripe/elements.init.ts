import { dispatchCustomEvent } from '@lib/plugin/helpers/event-handling';

import { generateElementOptions } from './elements.appearance';
import config from './elements.config';
import type { StripeAppearanceEvent } from './elements.events';
import events from './elements.events';
import queries from './elements.queries';
import type { StripeFunctionConstructorProps, StripeLayout, StripeTheme } from './elements.types';

const workers: string[] = [];

export const initStripe = (props: StripeFunctionConstructorProps) => async (container: HTMLDivElement) => {
  if (container.dataset.hidden === '') {
    return;
  }

  const { elementMap, form, stripe } = props;
  const { fieldMapping } = config(form);

  const field = container.querySelector<HTMLDivElement>('.freeform-stripe-card');
  if (elementMap.has(field)) {
    return;
  }

  // Store an empty entry in the elementMap to prevent duplicate initialization
  elementMap.set(field, {
    empty: true,
    elements: null,
    paymentIntent: null,
  });

  field.innerHTML = 'Loading...';

  const amountFieldHandles = field.dataset.amountFields?.split(';') ?? [];

  queries.paymentIntents
    .create(field.dataset.integration, form)
    .then(({ data: { id, secret } }) => {
      // Set the PaymentIntent ID as the field value
      (field.previousSibling as HTMLInputElement).value = id;

      const { elementOptions, paymentOptions } = generateElementOptions({
        theme: field.dataset?.theme as StripeTheme,
        layout: field.dataset?.layout as StripeLayout,
        floatingLabels: field.dataset.floatingLabels !== undefined,
      });

      // Dispatch an event which lets other scripts modify the appearance of the Stripe element
      const event = dispatchCustomEvent<StripeAppearanceEvent>(
        events.render.appearance,
        {
          bubbles: true,
          elementOptions,
          paymentOptions,
        },
        [field]
      );

      let elements = stripe.elements({
        ...event.elementOptions,
        clientSecret: secret,
      });

      let paymentElement = elements.create('payment', event.paymentOptions);
      paymentElement.mount(field);

      // Store state of the element emptiness
      // Non-required, empty elements will not prevent form from submitting
      paymentElement.on('change', (event) => {
        elementMap.get(field).empty = event.empty && !event.complete;
      });

      // Listen for changes to the amount, interval and interval count fields
      amountFieldHandles.forEach((amountFieldHandle) => {
        (form[amountFieldHandle] as HTMLInputElement)?.addEventListener('change', () => {
          workers.push(amountFieldHandle);
          form.freeform.disableForm();
          const paymentIntentId = elementMap.get(field).paymentIntent.id;

          queries.paymentIntents
            .updateAmount(field.dataset.integration, form, paymentIntentId)
            .then(({ id, client_secret }) => {
              // If a client_secret is returned - we need to recreate the Stripe element
              if (client_secret) {
                paymentElement.unmount();
                elements = stripe.elements({ clientSecret: client_secret });

                paymentElement = elements.create('payment', event.paymentOptions);
                paymentElement.mount(field);
                paymentElement.on('change', (event) => {
                  elementMap.get(field).empty = event.empty && !event.complete;
                });

                elementMap.set(field, {
                  empty: true,
                  elements,
                  paymentIntent: {
                    id,
                    secret: client_secret,
                  },
                });
              } else {
                elements.fetchUpdates();
              }
            })
            .catch((error) => {
              form.freeform._renderFieldErrors({
                [amountFieldHandle]: [error.response.data.message],
              });
            })
            .finally(() => {
              workers.pop();
              if (!workers.length) {
                form.freeform.enableForm();
              }
            });
        });
      });

      // Listen for changes to any mapped fields which affect the Customer
      const hasCustomMapping = fieldMapping.some(({ target }) => target === undefined);
      const listener = (source: string) => (event: Event) => {
        const value = (event.target as HTMLInputElement).value;

        queries.customers.update({
          integration: field.dataset.integration,
          form,
          paymentIntentId: id,
          key: source,
          value,
        });
      };

      // If there's a custom mapping present, we need to listen to all input changes
      if (hasCustomMapping) {
        const allFields = form.querySelectorAll<HTMLInputElement>('input:not([type="hidden"]), select, textarea');

        allFields.forEach((field) => {
          field.addEventListener('change', listener(field.name));
        });
      } else {
        fieldMapping.forEach(({ source, target }) => {
          (form[target] as HTMLInputElement)?.addEventListener('change', listener(source));
        });
      }

      elementMap.set(field, {
        empty: true,
        elements,
        paymentIntent: {
          id,
          secret,
        },
      });
    })
    .catch((error) => {
      elementMap.delete(field);
      field.innerHTML = 'Could not load payment element.';

      const errors: Record<string, string[]> = {};
      amountFieldHandles.forEach((amountFieldHandle) => {
        errors[amountFieldHandle] = [error.response.data.message];
      });

      form.freeform._renderFieldErrors(errors);

      const executeOnce = () => {
        initStripe(props)(container);

        amountFieldHandles.forEach((amountFieldHandle) => {
          (form[amountFieldHandle] as HTMLInputElement)?.removeEventListener('change', executeOnce);
        });
      };

      amountFieldHandles.forEach((amountFieldHandle) => {
        (form[amountFieldHandle] as HTMLInputElement)?.addEventListener('change', executeOnce);
      });
    });
};
