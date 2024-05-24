import { useContext, useState } from "react";
import "../node_modules/xterm/css/xterm.css";

import "./form.css";
import { SpawnerFormContext } from "./state";
import { ProfileOptions } from "./ProfileOptions";

/**
 * Generates the *contents* of the form shown in the profile selection page
 *
 * A <form> tag is generated by JupyterHub, and we don't have control over it. A <submit>
 * is also generated, but we hide it with CSS and use our own so we have better control over
 * validation.
 */
function Form() {
  const {
    profile: selectedProfile,
    setProfile,
    profileList,
  } = useContext(SpawnerFormContext);
  const [formError, setFormError] = useState("");

  const handleSubmit = (e) => {
    setFormError("");
    const form = e.target.closest("form");

    // validate the form
    const formIsValid = form.checkValidity();

    // prevent form submit
    if (!formIsValid) {
      setFormError(!selectedProfile ? "Select a container profile" : "");
      e.preventDefault();
    }
  };

  const handleProfileSelect = (e) => {
    const slug = e.target.value;
    setProfile(slug);
    setFormError("");
  };

  return (
    <fieldset
      aria-label="Select profile"
      aria-description="First, select the profile; second, configure the options for the selected profile."
    >
      {formError && <div className="profile-form-error">{formError}</div>}
      <input
        type="radio"
        className="hidden"
        name="profile"
        value={selectedProfile?.slug}
        checked
        readOnly
      />
      {profileList.map((profile) => {
        const { display_name, description, profile_options, slug } = profile;

        return (
          <div key={slug} className="profile-select">
            <input
              type="radio"
              name="select-profile"
              id={`profile-option-${slug}`}
              value={slug}
              onChange={handleProfileSelect}
              required
              checked={selectedProfile?.slug === slug}
            />
            <div className="profile-select-body">
              <label
                htmlFor={`profile-option-${slug}`}
                className="profile-select-label"
              >
                <span className="profile-select-label-heading">
                  {display_name}
                </span>
                <span>{description}</span>
              </label>

              <ProfileOptions profile={slug} config={profile_options} />
            </div>
          </div>
        );
      })}
      <button
        className="btn btn-jupyter form-control"
        type="submit"
        onClick={handleSubmit}
      >
        Start
      </button>
    </fieldset>
  );
}

export default Form;
