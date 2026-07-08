export interface WebComponentPartSpec {
  readonly name: string;
  readonly tagName: string;
  readonly defaultRole: string | null;
  readonly defaultAttributes: Readonly<Record<string, string>>;
}

export interface WebComponentSpec {
  readonly slug: string;
  readonly packageName: string;
  readonly requirementAttributes: readonly string[];
  readonly parts: readonly WebComponentPartSpec[];
}

export interface WebComponentHelperSpec<TPartSpec extends WebComponentPartSpec = WebComponentPartSpec> {
  readonly packageName: string;
  readonly parts: readonly TPartSpec[];
}
